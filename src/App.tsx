import * as React from 'react'
import { EditorToolbar } from '@/components/editor/editor-toolbar'
import { PersonalInfoForm } from '@/components/editor/personal-info-form'
import { SectionManager } from '@/components/editor/section-manager'
import { Header } from '@/components/header'
import { PreviewToolbar } from '@/components/preview/preview-toolbar'
import { TypstPreview } from '@/components/preview/typst-preview'
import { ThemeProvider } from '@/components/theme-provider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DEFAULT_CV, EMPTY_CV } from '@/lib/cv-defaults'
import { sanitizeCVData } from '@/lib/cv-sanitizer'
import {
  checkTypstStatus,
  compileTypstSVG,
  downloadTypstPDF,
} from '@/services/typst-service'
import type { CVData, FormatoPapel, PlantillaTipo } from '@/types/cv'

const STORAGE_KEY = 'killa-cv-data-v2'

function App() {
  // 1. Inicialización de datos con persistencia en localStorage
  const [cvData, setCvData] = React.useState<CVData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.warn('Error al leer de localStorage:', e)
    }
    return DEFAULT_CV
  })

  // 2. Parámetros de maquetación
  const [plantilla, setPlantilla] = React.useState<PlantillaTipo>(
    cvData.plantilla || 'harvard'
  )
  const [paper, setPaper] = React.useState<FormatoPapel>('a4')

  // 3. Estados de compilación y visualización
  const [pages, setPages] = React.useState<string[]>([])
  const [totalPages, setTotalPages] = React.useState(0)
  const [isCompiling, setIsCompiling] = React.useState(false)
  const [compileError, setCompileError] = React.useState<string | undefined>()
  const [typstVersion, setTypstVersion] = React.useState<string | undefined>()
  const [isDownloadingPDF, setIsDownloadingPDF] = React.useState(false)

  // 4. Guardar en localStorage ante cambios
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData))
    } catch (e) {
      console.warn('Error al guardar en localStorage:', e)
    }
  }, [cvData])

  // 5. Verificar estado de Typst CLI al iniciar
  React.useEffect(() => {
    checkTypstStatus().then((res) => {
      if (res.ok && res.version) {
        setTypstVersion(res.version)
      } else if (res.error) {
        console.warn('Diagnóstico Typst CLI:', res.error)
      }
    })
  }, [])

  // 6. Compilación reactiva con debounce de 350ms
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

  // Handlers
  const handlePlantillaChange = (newPlantilla: PlantillaTipo) => {
    setPlantilla(newPlantilla)
    setCvData((prev) => ({ ...prev, plantilla: newPlantilla }))
  }

  const handleDownloadPDF = async () => {
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
  }

  const handleExportJSON = () => {
    const clean = sanitizeCVData(cvData)
    const blob = new Blob([JSON.stringify(clean, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cv.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const parsed = JSON.parse(content)
        if (!parsed.datos_personales || !Array.isArray(parsed.secciones)) {
          throw new Error('El archivo no cumple con la estructura mínima de cv.schema.json')
        }
        setCvData(parsed)
        if (parsed.plantilla) {
          setPlantilla(parsed.plantilla)
        }
      } catch (err) {
        alert(`Error al importar JSON: ${(err as Error)?.message}`)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleResetDefault = () => {
    if (window.confirm('¿Deseas restablecer el CV con el perfil de ejemplo (John Doe)?')) {
      setCvData(DEFAULT_CV)
      setPlantilla('harvard')
    }
  }

  const handleClearData = () => {
    if (window.confirm('¿Deseas vaciar todos los campos del CV para comenzar desde cero?')) {
      setCvData(EMPTY_CV)
    }
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="killa-ui-theme">
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-background font-sans text-foreground transition-colors duration-300">
        <Header />

        <main className="flex-1 w-full max-w-[1700px] mx-auto p-4 sm:p-6 lg:p-8">
          {/* Resplandor ambiental de fondo */}
          <div className="pointer-events-none fixed -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-[140px]" />

          {/* Vista móvil con Tabs */}
          <div className="lg:hidden">
            <Tabs defaultValue="editor" className="w-full space-y-4">
              <TabsList className="w-full grid grid-cols-2 bg-surface-container-low/70 border border-border/60">
                <TabsTrigger value="editor">Editor de CV</TabsTrigger>
                <TabsTrigger value="preview">
                  Vista Previa {isCompiling && '•'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="space-y-4">
                <EditorToolbar
                  onClearData={handleClearData}
                  onResetDefault={handleResetDefault}
                  onExportJSON={handleExportJSON}
                  onImportJSON={handleImportJSON}
                />
                <PersonalInfoForm
                  data={cvData.datos_personales}
                  onChange={(dp) => setCvData((prev) => ({ ...prev, datos_personales: dp }))}
                />
                <SectionManager
                  sections={cvData.secciones}
                  onChange={(secs) => setCvData((prev) => ({ ...prev, secciones: secs }))}
                />
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <PreviewToolbar
                  plantilla={plantilla}
                  onPlantillaChange={handlePlantillaChange}
                  paper={paper}
                  onPaperChange={setPaper}
                  onDownloadPDF={handleDownloadPDF}
                  isDownloadingPDF={isDownloadingPDF}
                />
                <TypstPreview
                  pages={pages}
                  totalPages={totalPages}
                  isCompiling={isCompiling}
                  error={compileError}
                  typstVersion={typstVersion}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Vista Desktop Split-Screen (Dos Columnas) */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-start">
            {/* Columna Izquierda: Barra de Datos, Formulario y Gestor de Secciones */}
            <div className="lg:col-span-6 xl:col-span-5 space-y-4 pb-20">
              <EditorToolbar
                onClearData={handleClearData}
                onResetDefault={handleResetDefault}
                onExportJSON={handleExportJSON}
                onImportJSON={handleImportJSON}
              />
              <PersonalInfoForm
                data={cvData.datos_personales}
                onChange={(dp) => setCvData((prev) => ({ ...prev, datos_personales: dp }))}
              />
              <SectionManager
                sections={cvData.secciones}
                onChange={(secs) => setCvData((prev) => ({ ...prev, secciones: secs }))}
              />
            </div>

            {/* Columna Derecha: Toolbar Sticky + Visor Typst en Tiempo Real */}
            <div className="lg:col-span-6 xl:col-span-7 sticky top-20 space-y-4">
              <PreviewToolbar
                plantilla={plantilla}
                onPlantillaChange={handlePlantillaChange}
                paper={paper}
                onPaperChange={setPaper}
                onDownloadPDF={handleDownloadPDF}
                isDownloadingPDF={isDownloadingPDF}
              />
              <div className="h-[calc(100vh-160px)]">
                <TypstPreview
                  pages={pages}
                  totalPages={totalPages}
                  isCompiling={isCompiling}
                  error={compileError}
                  typstVersion={typstVersion}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
