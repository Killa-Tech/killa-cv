import * as React from 'react'
import { useDebounce } from '@/core/hooks/use-debounce'
import { downloadBlob } from '@/core/lib/download'
import type { CVData, FormatoPapel, PlantillaTipo } from '@/domain/cv'
import { wasmTypstEngine } from '../engine/wasm-engine'

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

  const [pages, setPages] = React.useState<string[]>([])
  const [totalPages, setTotalPages] = React.useState<number>(0)
  const [isCompiling, setIsCompiling] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)
  const [typstVersion, setTypstVersion] = React.useState<string | null>(null)
  const [isDownloadingPDF, setIsDownloadingPDF] = React.useState<boolean>(false)

  // Disparador manual para recompilar
  const [recompileTrigger, setRecompileTrigger] = React.useState<number>(0)

  // Aplicar debounce sobre los datos reactivos del CV
  const debouncedCVData = useDebounce(cvData, debounceMs)
  const debouncedPlantilla = useDebounce(plantilla, debounceMs)
  const debouncedPaper = useDebounce(paper, debounceMs)

  // Verificar estado del motor Typst WASM al montar
  React.useEffect(() => {
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
  const abortControllerRef = React.useRef<AbortController | null>(null)

  // Efecto asíncrono puro que sincroniza la compilación ante cambios debounced o forzados
  React.useEffect(() => {
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
  const recompile = React.useCallback(async () => {
    setRecompileTrigger((prev) => prev + 1)
  }, [])

  // Función para descargar PDF
  const downloadPDF = React.useCallback(
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
