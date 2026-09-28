import * as React from 'react'
import { EditorToolbar } from '@/components/editor/editor-toolbar'
import { PersonalInfoForm } from '@/components/editor/personal-info-form'
import { SectionManager } from '@/components/editor/section-manager'
import { Header } from '@/components/header'
import { PreviewToolbar } from '@/components/preview/preview-toolbar'
import { TypstPreview } from '@/components/preview/typst-preview'
import { ThemeProvider } from '@/components/theme-provider'
import { useCVData } from '@/hooks/use-cv-data'
import { useTypstCompiler } from '@/hooks/use-typst-compiler'

function App() {
  const {
    cvData,
    plantilla,
    setPlantilla,
    paper,
    setPaper,
    setPersonalInfo,
    setSections,
    resetDefault,
    clearData,
    exportJSON,
    importJSON,
  } = useCVData()

  const {
    pages,
    totalPages,
    isCompiling,
    compileError,
    typstVersion,
    isDownloadingPDF,
    downloadPDF,
  } = useTypstCompiler(cvData, plantilla, paper)

  const [mobileTab, setMobileTab] = React.useState<'editor' | 'preview'>('editor')

  return (
    <ThemeProvider defaultTheme="dark" storageKey="killa-ui-theme">
      <div className="relative flex h-dvh flex-col overflow-hidden bg-background font-sans text-foreground transition-colors duration-300">
        <Header className="shrink-0" />

        <main className="flex-1 min-h-0 w-full max-w-[1800px] mx-auto p-3 sm:p-4 overflow-hidden flex flex-col">
          {/* Resplandor ambiental de fondo */}
          <div className="pointer-events-none fixed -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-[140px]" />

          {/* Barra de pestañas móvil (< lg) */}
          <div className="lg:hidden shrink-0 mb-2">
            <div className="grid grid-cols-2 p-1 rounded-lg bg-surface-container-low/70 border border-border/60">
              <button
                type="button"
                onClick={() => setMobileTab('editor')}
                className={`py-1.5 text-xs font-heading font-medium rounded-md transition-colors ${
                  mobileTab === 'editor'
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Editor de CV
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('preview')}
                className={`py-1.5 text-xs font-heading font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                  mobileTab === 'preview'
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>Vista Previa</span>
                {isCompiling && <span className="size-1.5 rounded-full bg-primary inline-block animate-ping" />}
              </button>
            </div>
          </div>

          {/* Contenedor Workbench de Dos Columnas (Unificado para Móvil y Desktop) */}
          <div className="grid lg:grid-cols-12 gap-4 lg:gap-6 flex-1 min-h-0 h-full">
            {/* Columna Izquierda: Scrollable autónomo para todo el editor */}
            <div
              className={`lg:col-span-6 xl:col-span-5 flex-col h-full min-h-0 space-y-4 overflow-y-auto pr-1.5 scrollbar-thin ${
                mobileTab === 'editor' ? 'flex' : 'hidden lg:flex'
              }`}
            >
              <EditorToolbar
                onClearData={clearData}
                onResetDefault={resetDefault}
                onExportJSON={exportJSON}
                onImportJSON={importJSON}
              />
              <PersonalInfoForm
                data={cvData.datos_personales}
                onChange={setPersonalInfo}
              />
              <SectionManager
                sections={cvData.secciones}
                onChange={setSections}
              />
            </div>

            {/* Columna Derecha: Visor Typst de altura completa autocontenido */}
            <div
              className={`lg:col-span-6 xl:col-span-7 flex-col h-full min-h-0 space-y-3 ${
                mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'
              }`}
            >
              <PreviewToolbar
                plantilla={plantilla}
                onPlantillaChange={setPlantilla}
                paper={paper}
                onPaperChange={setPaper}
                onDownloadPDF={downloadPDF}
                isDownloadingPDF={isDownloadingPDF}
              />
              <div className="flex-1 min-h-0 overflow-hidden">
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
