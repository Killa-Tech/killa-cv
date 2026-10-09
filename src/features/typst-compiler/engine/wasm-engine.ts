import type { CVData, FormatoPapel, PlantillaTipo } from '@/domain/cv'
import type {
  TypstCompilerEngine,
  TypstCompileSVGResult,
  TypstStatusResult,
} from './types'

interface PendingRequest {
  resolve: (value: any) => void
  reject: (reason: any) => void
  abortCleanup?: () => void
}

// 5 minutos de inactividad antes de purgar el Worker y liberar la memoria
const IDLE_PURGE_TIMEOUT_MS = 5 * 60 * 1000

class WorkerTypstEngine implements TypstCompilerEngine {
  private worker: Worker | null = null
  private pendingRequests = new Map<string, PendingRequest>()
  private requestIdCounter = 0
  private idleTimer: ReturnType<typeof setTimeout> | null = null

  private getWorker(): Worker {
    if (!this.worker) {
      // Instanciación nativa de Worker en ESM soportada por Vite
      this.worker = new Worker(new URL('./typst.worker.ts', import.meta.url), {
        type: 'module',
      })
      this.worker.onmessage = this.handleMessage.bind(this)
      this.worker.onerror = this.handleError.bind(this)
    }
    this.resetIdleTimer()
    return this.worker
  }

  private handleMessage(event: MessageEvent): void {
    const { id, ok, result, pdfBytes, version, error } = event.data
    const request = this.pendingRequests.get(id)
    if (!request) return

    this.pendingRequests.delete(id)
    if (request.abortCleanup) {
      request.abortCleanup()
    }

    if (ok) {
      if (pdfBytes) {
        request.resolve(pdfBytes)
      } else if (result) {
        request.resolve(result)
      } else {
        request.resolve({ ok: true, version })
      }
    } else {
      request.reject(new Error(error || 'Error desconocido en el Worker de Typst.'))
    }
  }

  private handleError(errorEvent: ErrorEvent): void {
    console.error('[TypstWorker Error]:', errorEvent)
    for (const [, req] of this.pendingRequests.entries()) {
      req.reject(new Error(errorEvent.message || 'Error en el Worker'))
      if (req.abortCleanup) req.abortCleanup()
    }
    this.pendingRequests.clear()
    this.terminate()
  }

  private resetIdleTimer(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer)
    }
    this.idleTimer = setTimeout(() => {
      this.terminate()
    }, IDLE_PURGE_TIMEOUT_MS)
  }

  /**
   * Termina el worker y devuelve el 100% de la memoria WebAssembly al sistema operativo.
   */
  terminate(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer)
      this.idleTimer = null
    }
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
      console.info('[TypstWorker] Memoria de WebAssembly purgada por inactividad.')
    }
  }

  private postRequest<T>(type: string, payload?: unknown, signal?: AbortSignal): Promise<T> {
    if (signal?.aborted) {
      return Promise.reject(new DOMException('Aborted', 'AbortError'))
    }

    const worker = this.getWorker()
    const id = `req_${++this.requestIdCounter}_${Date.now()}`

    return new Promise<T>((resolve, reject) => {
      let abortCleanup: (() => void) | undefined

      if (signal) {
        const onAbort = () => {
          this.pendingRequests.delete(id)
          reject(new DOMException('Aborted', 'AbortError'))
        }
        signal.addEventListener('abort', onAbort, { once: true })
        abortCleanup = () => {
          signal.removeEventListener('abort', onAbort)
        }
      }

      this.pendingRequests.set(id, { resolve, reject, abortCleanup })
      worker.postMessage({ id, type, payload })
    })
  }

  async init(): Promise<void> {
    await this.postRequest('init')
  }

  async checkStatus(): Promise<TypstStatusResult> {
    try {
      const res = await this.postRequest<{ ok: boolean; version?: string }>('init')
      return { ok: true, version: res.version || 'Typst WASM 0.15' }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : String(err) }
    }
  }

  async compileSVG(
    cvData: CVData,
    plantilla: PlantillaTipo = 'harvard',
    paper: FormatoPapel = 'a4',
    signal?: AbortSignal
  ): Promise<TypstCompileSVGResult> {
    try {
      return await this.postRequest<TypstCompileSVGResult>(
        'compileSVG',
        { cvData, plantilla, paper },
        signal
      )
    } catch (err: unknown) {
      if (signal?.aborted || (err as Error)?.name === 'AbortError') {
        throw err
      }
      return {
        ok: false,
        pages: [],
        totalPages: 0,
        error: err instanceof Error ? err.message : String(err),
      }
    }
  }

  async compilePDF(
    cvData: CVData,
    plantilla: PlantillaTipo = 'harvard',
    paper: FormatoPapel = 'a4'
  ): Promise<Uint8Array> {
    return await this.postRequest<Uint8Array>('compilePDF', { cvData, plantilla, paper })
  }
}

export const wasmTypstEngine = new WorkerTypstEngine()
