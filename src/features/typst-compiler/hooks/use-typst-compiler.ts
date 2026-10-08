import { useDebounce } from '@/core/hooks/use-debounce'
import { downloadBlob } from '@/core/lib/download'
import type { CVData, FormatoPapel, PlantillaTipo } from '@/domain/cv'
import { wasmTypstEngine } from '../engine/wasm-engine'
import { useCompilerStore } from '../store/compiler-store'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseTypstCompilerOptions {
  debounceMs?: number
}

export interface UseTypstCompilerReturn {
  pages: string[]
  totalPages: number
  isCompiling: boolean
  error: string | null
  typstVersion: string | null
  isDownloadingPDF: boolean
  downloadPDF: (customFilename?: string) => Promise<void>
  recompile: () => Promise<void>
}

export function useTypstCompiler(
  cvData: CVData,
  plantilla: PlantillaTipo = 'harvard',
  paper: FormatoPapel = 'a4',
  options: UseTypstCompilerOptions = {}
): UseTypstCompilerReturn {
  const { debounceMs = 350 } = options

  const [pages, setPages] = useState<string[]>([])
  const [totalPages, setTotalPages] = useState<number>(0)
  const [isDownloadingPDF, setIsDownloadingPDF] = useState<boolean>(false)


  // Estado global de compilador sincronizado via Zustand
  const isCompiling = useCompilerStore((state) => state.isCompiling)
  const error = useCompilerStore((state) => state.error)
  const typstVersion = useCompilerStore((state) => state.typstVersion)
  const setIsCompiling = useCompilerStore((state) => state.setIsCompiling)
  const setError = useCompilerStore((state) => state.setError)
  const setTypstVersion = useCompilerStore((state) => state.setTypstVersion)

  // Disparador manual para recompilar
  const [recompileTrigger, setRecompileTrigger] = useState<number>(0)

  // Aplicar debounce sobre los datos reactivos del CV
  const debouncedCVData = useDebounce(cvData, debounceMs)
  const debouncedPlantilla = useDebounce(plantilla, debounceMs)
  const debouncedPaper = useDebounce(paper, debounceMs)

  // Verificar estado del motor Typst WASM al montar
  useEffect(() => {
    let isMounted = true

    wasmTypstEngine.checkStatus().then((status) => {
      if (!isMounted) return
      if (status.ok && status.version) {
        setTypstVersion(status.version)
      } else if (!status.ok && status.error) {
        setError(`Error al iniciar motor Typst: ${status.error}`)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  // Referencia al AbortController activo para cancelar compilaciones previas
  const abortControllerRef = useRef<AbortController | null>(null)

  // Efecto asíncrono puro que sincroniza la compilación ante cambios debounced o forzados
  useEffect(() => {
    let isCurrent = true

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    const executeCompilation = async () => {
      setIsCompiling(true)

      try {
        const result = await wasmTypstEngine.compileSVG(
          debouncedCVData,
          debouncedPlantilla,
          debouncedPaper,
          controller.signal
        )

        if (!isCurrent || controller.signal.aborted) return

        if (result.ok) {
          setPages(result.pages)
          setTotalPages(result.totalPages)
          setError(null)
        } else {
          setError(result.error || 'Error desconocido al compilar documento.')
        }
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError' || controller.signal.aborted || !isCurrent) {
          return
        }
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        if (isCurrent && !controller.signal.aborted) {
          setIsCompiling(false)
        }
      }
    }

    executeCompilation()

    return () => {
      isCurrent = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [debouncedCVData, debouncedPlantilla, debouncedPaper, recompileTrigger])

  // Función para forzar re-compilación inmediata
  const recompile = useCallback(async () => {
    setRecompileTrigger((prev) => prev + 1)
  }, [])

  // Función para descargar PDF
  const downloadPDF = useCallback(
    async (customFilename?: string) => {
      setIsDownloadingPDF(true)
      try {
        const pdfBytes = await wasmTypstEngine.compilePDF(cvData, plantilla, paper)
        const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' })

        const defaultName = cvData.datos_personales?.nombre_completo?.trim().replace(/\s+/g, '_') || 'cv'
        const filename = customFilename || `${defaultName}.pdf`

        downloadBlob(blob, filename)
      } catch (err) {
        console.error('Error al exportar documento PDF:', err)
        setError(err instanceof Error ? err.message : 'Error al exportar PDF')
      } finally {
        setIsDownloadingPDF(false)
      }
    },
    [cvData, plantilla, paper]
  )

  return {
    pages,
    totalPages,
    isCompiling,
    error,
    typstVersion,
    isDownloadingPDF,
    downloadPDF,
    recompile,
  }
}
