import * as React from 'react'
import {
  checkTypstStatus,
  compileTypstSVG,
  downloadTypstPDF,
} from '@/services/typst-service'
import type { CVData, FormatoPapel, PlantillaTipo } from '@/types/cv'

export function useTypstCompiler(cvData: CVData, plantilla: PlantillaTipo, paper: FormatoPapel) {
  const [pages, setPages] = React.useState<string[]>([])
  const [totalPages, setTotalPages] = React.useState(0)
  const [isCompiling, setIsCompiling] = React.useState(false)
  const [compileError, setCompileError] = React.useState<string | undefined>()
  const [typstVersion, setTypstVersion] = React.useState<string | undefined>()
  const [isDownloadingPDF, setIsDownloadingPDF] = React.useState(false)

  // 1. Diagnóstico de estado del motor al montar
  React.useEffect(() => {
    checkTypstStatus().then((res) => {
      if (res.ok && res.version) {
        setTypstVersion(res.version)
      } else if (res.error) {
        console.warn('Diagnóstico Typst CLI:', res.error)
      }
    })
  }, [])

  // 2. Compilación reactiva con debounce de 350ms y cancelación
  React.useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setIsCompiling(true)
      try {
        const result = await compileTypstSVG(cvData, plantilla, paper, controller.signal)
        if (result.ok) {
          setPages(result.pages)
          setTotalPages(result.totalPages)
          setCompileError(undefined)
        } else {
          setCompileError(result.error)
        }
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          setCompileError((err as Error)?.message || 'Error desconocido')
        }
      } finally {
        setIsCompiling(false)
      }
    }, 350)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [cvData, plantilla, paper])

  // 3. Acción de descarga de PDF
  const downloadPDF = React.useCallback(async () => {
    try {
      setIsDownloadingPDF(true)
      const nombre = cvData.datos_personales.nombre_completo.trim() || 'Curriculum'
      const filename = `${nombre.replace(/\s+/g, '_')}_CV.pdf`
      await downloadTypstPDF(cvData, plantilla, paper, filename)
    } catch (err) {
      alert(`Error al descargar PDF: ${(err as Error)?.message}`)
    } finally {
      setIsDownloadingPDF(false)
    }
  }, [cvData, plantilla, paper])

  return {
    pages,
    totalPages,
    isCompiling,
    compileError,
    typstVersion,
    isDownloadingPDF,
    downloadPDF,
  }
}
