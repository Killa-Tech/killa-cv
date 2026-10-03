import { EditorToolbar } from '@/components/editor/editor-toolbar'
import { PersonalInfoForm } from '@/components/editor/personal-info-form'
import { SectionManager } from '@/components/editor/section-manager'
import { Header } from '@/components/header'
import { PreviewToolbar } from '@/components/preview/preview-toolbar'
import { TypstPreview } from '@/components/preview/typst-preview'
import { ThemeProvider } from '@/components/theme-provider'
import { useCVData } from '@/hooks/use-cv-data'
import { useTypstCompiler } from '@/hooks/use-typst-compiler'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

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

  const editorContent = (
    <div className="flex flex-col h-full min-h-0 space-y-4 overflow-y-auto pr-1.5 scrollbar-thin">
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
  )

  const previewContent = (
    <div className="flex flex-col h-full min-h-0 space-y-3">
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
  )

  return (
    <ThemeProvider defaultTheme="dark" storageKey="killa-ui-theme">
      <div className="relative flex h-dvh flex-col overflow-hidden bg-background font-sans text-foreground transition-colors duration-300">
        <Header className="shrink-0" />

        <main className="flex-1 min-h-0 w-full max-w-[1800px] mx-auto p-3 sm:p-4 overflow-hidden flex flex-col">
          <div className="pointer-events-none fixed -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-[140px]" />

          <div className="hidden lg:flex flex-1 min-h-0 h-full w-full">
            <ResizablePanelGroup orientation="horizontal">
              <ResizablePanel defaultSize={45} minSize={30}>
                {editorContent}
              </ResizablePanel>
              <ResizableHandle withHandle className="mx-4 bg-transparent hover:bg-border/50 transition-colors w-1" />
              <ResizablePanel defaultSize={55} minSize={30}>
                {previewContent}
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>

          <div className="flex lg:hidden flex-1 min-h-0 h-full flex-col">
            <Tabs defaultValue="editor" className="flex flex-col h-full w-full">
              <TabsList className="grid w-full grid-cols-2 mb-2 bg-surface-container-low/70 border border-border/60">
                <TabsTrigger value="editor" className="font-heading font-medium">
                  Editor de CV
                </TabsTrigger>
                <TabsTrigger value="preview" className="font-heading font-medium flex items-center justify-center gap-1.5">
                  <span>Vista Previa</span>
                  {isCompiling && <span className="size-1.5 rounded-full bg-primary inline-block animate-ping" />}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="editor" className="flex-1 min-h-0 m-0 data-[state=active]:flex flex-col">
                {editorContent}
              </TabsContent>
              <TabsContent value="preview" className="flex-1 min-h-0 m-0 data-[state=active]:flex flex-col">
                {previewContent}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
