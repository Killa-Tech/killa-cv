import * as React from 'react'
import { ThemeProvider } from '@/app/providers/theme-provider'
import { Button } from '@/core/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { Badge } from '@/core/ui/badge'
import { useCVStore } from '@/store'
import { useTypstCompiler } from '@/features/typst-compiler'
import { CVEditor } from '@/features/cv-editor'
import { FileDown, RefreshCw, CheckCircle2, AlertCircle, RotateCcw, Trash2, Edit3, Eye } from 'lucide-react'

export function App() {
  const [mobileTab, setMobileTab] = React.useState<'editor' | 'preview'>('editor')

  const cvData = useCVStore((state) => state.cvData)
  const formatoPapel = useCVStore((state) => state.formatoPapel)
  const setPlantilla = useCVStore((state) => state.setPlantilla)
  const resetToDefault = useCVStore((state) => state.resetToDefault)
  const clearData = useCVStore((state) => state.clearData)

  const plantilla = cvData.plantilla || 'harvard'

  const {
    pages,
    totalPages,
    isCompiling,
    error,
    typstVersion,
    isDownloadingPDF,
    downloadPDF,
    recompile,
  } = useTypstCompiler(cvData, plantilla, formatoPapel)

  return (
    <ThemeProvider defaultTheme="dark" storageKey="killa-ui-theme">
      <div className="relative flex h-dvh flex-col overflow-hidden bg-background font-sans text-foreground">
        {/* Resplandor ambiental de fondo Cyber Lunar */}
        <div className="pointer-events-none fixed -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

        {/* Barra superior de la aplicación */}
        <header className="shrink-0 z-20 border-b border-border/60 bg-surface-container-lowest/80 backdrop-blur-md px-3 sm:px-6 py-2.5">
          <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <h1 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  Killa CV
                </h1>
                <Badge variant="outline" className="border-primary/40 text-primary font-mono text-[9px] uppercase tracking-wider">
                  v2.0
                </Badge>
              </div>

              {/* Indicador de estado del compilador Typst */}
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-high/60 border border-border/40 text-[11px] font-mono text-muted-foreground">
                {isCompiling ? (
                  <span className="size-1.5 rounded-full bg-primary animate-ping" />
                ) : error ? (
                  <AlertCircle className="size-3 text-destructive" />
                ) : (
                  <CheckCircle2 className="size-3 text-primary" />
                )}
                <span>{isCompiling ? 'Compilando...' : error ? 'Error Typst' : typstVersion || 'WASM Listo'}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <div className="flex items-center p-0.5 rounded-lg bg-surface-container-low border border-border/60">
                <Button
                  variant={plantilla === 'harvard' ? 'default' : 'ghost'}
                  size="xs"
                  onClick={() => setPlantilla('harvard')}
                  className="text-xs h-6 px-2.5"
                >
                  Harvard
                </Button>
                <Button
                  variant={plantilla === 'modern' ? 'default' : 'ghost'}
                  size="xs"
                  onClick={() => setPlantilla('modern')}
                  className="text-xs h-6 px-2.5"
                >
                  Modern
                </Button>
              </div>

              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => resetToDefault()}
                className="gap-1 text-xs text-muted-foreground hover:text-foreground h-7"
                title="Cargar perfil de ejemplo"
              >
                <RotateCcw className="size-3" />
                <span className="hidden sm:inline">Ejemplo</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => clearData()}
                className="gap-1 text-xs text-destructive hover:bg-destructive/10 h-7"
                title="Vaciar todos los campos"
              >
                <Trash2 className="size-3" />
                <span className="hidden sm:inline">Vaciar</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => recompile()}
                disabled={isCompiling}
                className="gap-1 text-xs h-7"
                title="Forzar recompilación"
              >
                <RefreshCw className={`size-3 ${isCompiling ? 'animate-spin text-primary' : ''}`} />
                <span className="hidden sm:inline">Recompilar</span>
              </Button>

              <Button
                type="button"
                variant="default"
                size="xs"
                onClick={() => downloadPDF()}
                disabled={isDownloadingPDF || isCompiling}
                className="gap-1 text-xs font-heading font-semibold h-7 px-3 shadow-cyan-glow"
              >
                <FileDown className="size-3" />
                {isDownloadingPDF ? 'Exportando...' : 'Descargar PDF'}
              </Button>
            </div>
          </div>
        </header>

        {/* Pestañas para vista móvil (< lg) */}
        <div className="lg:hidden shrink-0 px-3 pt-2">
          <div className="grid grid-cols-2 p-1 rounded-lg bg-surface-container-low/70 border border-border/60">
            <button
              type="button"
              onClick={() => setMobileTab('editor')}
              className={`py-1.5 text-xs font-heading font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                mobileTab === 'editor'
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Edit3 className="size-3.5" />
              <span>Editor de CV</span>
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
              <Eye className="size-3.5" />
              <span>Vista Previa ({totalPages})</span>
              {isCompiling && <span className="size-1.5 rounded-full bg-primary inline-block animate-ping" />}
            </button>
          </div>
        </div>

        {/* Workbench de Dos Columnas (Editor a la izquierda, Preview a la derecha) */}
        <main className="flex-1 min-h-0 w-full max-w-[1920px] mx-auto p-3 sm:p-4 overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-4 lg:gap-6 h-full min-h-0">
            {/* Columna Izquierda: Editor de Secciones y Datos */}
            <div
              className={`lg:col-span-6 xl:col-span-5 h-full min-h-0 overflow-y-auto pr-1 sm:pr-2 space-y-4 ${
                mobileTab === 'editor' ? 'flex flex-col' : 'hidden lg:flex flex-col'
              }`}
            >
              <CVEditor />
            </div>

            {/* Columna Derecha: Vista Previa en Tiempo Real de Typst */}
            <div
              className={`lg:col-span-6 xl:col-span-7 h-full min-h-0 overflow-y-auto p-2 sm:p-4 rounded-xl border border-border/60 bg-surface-container-lowest/50 backdrop-blur-sm flex flex-col items-center gap-6 ${
                mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'
              }`}
            >
              {error && (
                <Card className="w-full max-w-xl border-destructive/40 bg-destructive/10 text-destructive-foreground shrink-0">
                  <CardHeader className="py-2.5 px-4">
                    <CardTitle className="text-xs font-mono font-semibold">Detalle del error Typst:</CardTitle>
                    <CardDescription className="text-xs text-destructive font-mono whitespace-pre-wrap">
                      {error}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}

              {pages.length === 0 && !isCompiling && (
                <div className="m-auto text-center p-8 text-muted-foreground text-xs font-mono">
                  Generando visualización previa del documento...
                </div>
              )}

              {pages.map((svgContent, index) => (
                <div
                  key={index}
                  className="w-full max-w-[750px] rounded-lg shadow-xl overflow-hidden border border-border/80 bg-white transition-transform"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
