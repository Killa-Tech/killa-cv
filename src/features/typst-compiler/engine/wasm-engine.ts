import compilerWasmUrl from '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url'
import rendererWasmUrl from '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url'
import { $typst } from '@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs'
import cvEngineSource from '@/assets/cv-engine.typ?raw'
import { sanitizeCVData, type CVData, type FormatoPapel, type PlantillaTipo } from '@/domain/cv'
import type {
  TypstCompilerEngine,
  TypstCompileSVGResult,
  TypstStatusResult,
} from './types'

function dataUriToUint8Array(dataUri: string): Uint8Array {
  const base64 = dataUri.split(',')[1] || ''
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

class WasmTypstEngine implements TypstCompilerEngine {
  private isInitialized = false
  private initPromise: Promise<void> | null = null

  async init(): Promise<void> {
    if (this.isInitialized) return
    if (this.initPromise) return this.initPromise

    this.initPromise = (async () => {
      // 1. Configurar módulos WebAssembly desde URLs de assets estáticos de Vite
      $typst.setCompilerInitOptions({
        getModule: () => compilerWasmUrl,
      })
      $typst.setRendererInitOptions({
        getModule: () => rendererWasmUrl,
      })

      // 2. Mapear el template principal en el sistema de archivos virtual
      const encoder = new TextEncoder()
      await $typst.mapShadow('/cv-engine.typ', encoder.encode(cvEngineSource))

      this.isInitialized = true
    })()

    return this.initPromise
  }

  async checkStatus(): Promise<TypstStatusResult> {
    try {
      await this.init()
      return {
        ok: true,
        version: 'Typst WASM 0.15',
      }
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      }
    }
  }

  async compileSVG(
    cvData: CVData,
    plantilla: PlantillaTipo = 'harvard',
    paper: FormatoPapel = 'a4',
    signal?: AbortSignal
  ): Promise<TypstCompileSVGResult> {
    try {
      if (signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError')
      }

      await this.init()

      if (signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError')
      }

      const cleanData = sanitizeCVData(cvData)
      const encoder = new TextEncoder()

      // Manejar foto avatar desacoplada
      const datosPersonales = cleanData.datos_personales as Record<string, unknown> | undefined
      const foto = typeof datosPersonales?.foto === 'string' ? datosPersonales.foto : undefined

      if (foto?.startsWith('data:image')) {
        const photoBytes = dataUriToUint8Array(foto)
        await $typst.mapShadow('/avatar.png', photoBytes)
        if (datosPersonales) {
          datosPersonales.foto = '/avatar.png'
        }
      } else {
        try {
          await $typst.unmapShadow('/avatar.png')
        } catch {
          // ignore si no existía previamente
        }
      }

      const jsonStr = JSON.stringify(cleanData)
      await $typst.mapShadow('/cv.json', encoder.encode(jsonStr))

      // Compilar a SVG
      const svgOutput = await $typst.svg({
        mainFilePath: '/cv-engine.typ',
        inputs: {
          data: '/cv.json',
          plantilla,
          paper,
        },
      })

      if (!svgOutput) {
        throw new Error('El compilador no generó salida SVG.')
      }

      const pages = this.extractPagesFromSvg(svgOutput)

      return {
        ok: true,
        pages,
        totalPages: pages.length,
      }
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
    await this.init()

    const cleanData = sanitizeCVData(cvData)
    const encoder = new TextEncoder()

    const datosPersonales = cleanData.datos_personales as Record<string, unknown> | undefined
    const foto = typeof datosPersonales?.foto === 'string' ? datosPersonales.foto : undefined

    if (foto?.startsWith('data:image')) {
      const photoBytes = dataUriToUint8Array(foto)
      await $typst.mapShadow('/avatar.png', photoBytes)
      if (datosPersonales) {
        datosPersonales.foto = '/avatar.png'
      }
    } else {
      try {
        await $typst.unmapShadow('/avatar.png')
      } catch {
        // ignore
      }
    }

    const jsonStr = JSON.stringify(cleanData)
    await $typst.mapShadow('/cv.json', encoder.encode(jsonStr))

    const pdfBytes = await $typst.pdf({
      mainFilePath: '/cv-engine.typ',
      inputs: {
        data: '/cv.json',
        plantilla,
        paper,
      },
    })

    if (!pdfBytes) {
      throw new Error('El compilador no generó bytes de PDF.')
    }

    return pdfBytes
  }

  private extractPagesFromSvg(svgString: string): string[] {
    const svgTags = svgString.match(/<svg[\s\S]*?<\/svg>/gi)
    if (svgTags && svgTags.length > 1) {
      return svgTags
    }
    return [svgString]
  }
}

export const wasmTypstEngine = new WasmTypstEngine()
