import * as React from 'react'
import { ThemeProvider } from '@/app/providers/theme-provider'
import { Button } from '@/core/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { Badge } from '@/core/ui/badge'
import { DEFAULT_CV } from '@/domain/cv'
import { useTypstCompiler } from '@/features/typst-compiler'
import { FileDown, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'

export function App() {
  const [plantilla, setPlantilla] = React.useState<'harvard' | 'modern'>('harvard')
  const {
    pages,
    totalPages,
    isCompiling,
    error,
    typstVersion,
    isDownloadingPDF,
    downloadPDF,
    recompile,
  } = useTypstCompiler(DEFAULT_CV, plantilla, 'a4')

  return (
    <ThemeProvider defaultTheme="dark" storageKey="killa-ui-theme">
      <div className="relative min-h-dvh flex flex-col p-4 sm:p-6 bg-background font-sans text-foreground overflow-y-auto">
        {/* Resplandor ambiental de fondo Cyber Lunar */}
        <div className="pointer-events-none fixed -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

        <header className="max-w-5xl mx-auto w-full mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Killa CV
              </h1>
              <Badge variant="outline" className="border-primary/40 text-primary font-mono text-[10px] uppercase tracking-wider">
                Fase 3: Typst WASM
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Motor WebAssembly desacoplado y compilador reactivo con debounce y cancelación.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={plantilla === 'harvard' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPlantilla('harvard')}
              className="text-xs"
            >
              Harvard
            </Button>
            <Button
              variant={plantilla === 'modern' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPlantilla('modern')}
              className="text-xs"
            >
              Modern
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => recompile()}
              disabled={isCompiling}
              className="gap-1.5 text-xs"
            >
              <RefreshCw className={`size-3.5 ${isCompiling ? 'animate-spin text-primary' : ''}`} />
              Recompilar
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => downloadPDF()}
              disabled={isDownloadingPDF || isCompiling}
              className="gap-1.5 text-xs font-semibold"
            >
              <FileDown className="size-3.5" />
              {isDownloadingPDF ? 'Generando PDF...' : 'Descargar PDF'}
            </Button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto w-full space-y-6">
          {/* Barra de estado del compilador */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-surface-container-low border border-border/60 text-xs">
            <div className="flex items-center gap-2">
              {isCompiling ? (
                <span className="size-2 rounded-full bg-primary animate-ping" />
              ) : error ? (
                <AlertCircle className="size-4 text-destructive" />
              ) : (
                <CheckCircle2 className="size-4 text-primary" />
              )}
              <span className="font-mono text-muted-foreground">
                {isCompiling
                  ? 'Compilando Typst en WebAssembly...'
                  : error
                  ? 'Error en compilación'
                  : 'Compilación en memoria lista'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground font-mono text-[11px]">
              <span>Páginas: {totalPages}</span>
              <span>•</span>
              <span>Motor: {typstVersion || 'Inicializando...'}</span>
            </div>
          </div>

          {error && (
            <Card className="border-destructive/40 bg-destructive/10 text-destructive-foreground">
              <CardHeader className="py-2.5 px-4">
                <CardTitle className="text-xs font-mono font-semibold">Detalle del error:</CardTitle>
                <CardDescription className="text-xs text-destructive font-mono whitespace-pre-wrap">
                  {error}
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* Visor interactivo de páginas SVG */}
          <div className="flex flex-col items-center gap-6">
            {pages.map((svgContent, index) => (
              <div
                key={index}
                className="w-full max-w-[800px] rounded-lg shadow-2xl overflow-hidden border border-border/80 bg-white"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ))}
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
