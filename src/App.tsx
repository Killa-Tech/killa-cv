import * as React from 'react'
import { ThemeProvider, useTheme } from '@/app/providers/theme-provider'
import { Button } from '@/core/ui/button'
import { Badge } from '@/core/ui/badge'
import { useCVStore } from '@/store'
import { CVEditor } from '@/features/cv-editor'
import { CVPreview } from '@/features/cv-preview'
import { RotateCcw, Trash2, Edit3, Eye, Sun, Moon } from 'lucide-react'

function HeaderControls() {
  const resetToDefault = useCVStore((state) => state.resetToDefault)
  const clearData = useCVStore((state) => state.clearData)
  const { theme, setTheme } = useTheme()

  const handleReset = () => {
    if (window.confirm('¿Deseas restablecer el CV con el perfil de ejemplo (John Doe)?')) {
      resetToDefault()
    }
  }

  const handleClear = () => {
    if (window.confirm('¿Deseas vaciar todos los campos del CV para comenzar desde cero?')) {
      clearData()
    }
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Button
        type="button"
        variant="outline"
        size="xs"
        onClick={handleReset}
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
        onClick={handleClear}
        className="gap-1 text-xs text-destructive hover:bg-destructive/10 h-7"
        title="Vaciar todos los campos"
      >
        <Trash2 className="size-3" />
        <span className="hidden sm:inline">Vaciar</span>
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="size-7 text-muted-foreground hover:text-foreground"
        title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {theme === 'dark' ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
      </Button>
    </div>
  )
}

export function App() {
  const [mobileTab, setMobileTab] = React.useState<'editor' | 'preview'>('editor')

  return (
    <ThemeProvider defaultTheme="dark" storageKey="killa-ui-theme">
      <div className="relative flex h-dvh flex-col overflow-hidden bg-background font-sans text-foreground">
        {/* Resplandor ambiental de fondo Cyber Lunar */}
        <div className="pointer-events-none fixed -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

        {/* Barra superior de la aplicación */}
        <header className="shrink-0 z-20 border-b border-border/60 bg-surface-container-lowest/80 backdrop-blur-md px-3 sm:px-6 py-2">
          <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
                Killa CV
              </h1>
              <Badge variant="outline" className="border-primary/40 text-primary font-mono text-[9px] uppercase tracking-wider">
                v2.0
              </Badge>
              <span className="hidden md:inline text-xs text-muted-foreground font-mono">
                • Maquetador de CVs en Typst WebAssembly
              </span>
            </div>

            <HeaderControls />
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
              <span>Vista Previa</span>
            </button>
          </div>
        </div>

        {/* Workbench de Dos Columnas (Editor a la izquierda, Preview a la derecha) */}
        <main className="flex-1 min-h-0 w-full max-w-[1920px] mx-auto p-3 sm:p-4 overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-4 lg:gap-6 h-full min-h-0">
            {/* Columna Izquierda: Editor de Secciones y Datos */}
            <div
              className={`lg:col-span-5 xl:col-span-5 h-full min-h-0 overflow-y-auto pr-1 sm:pr-2 scrollbar-thin ${
                mobileTab === 'editor' ? 'flex flex-col' : 'hidden lg:flex flex-col'
              }`}
            >
              <CVEditor />
            </div>

            {/* Columna Derecha: Vista Previa y Controles de Typst */}
            <div
              className={`lg:col-span-7 xl:col-span-7 h-full min-h-0 ${
                mobileTab === 'preview' ? 'flex flex-col' : 'hidden lg:flex flex-col'
              }`}
            >
              <CVPreview />
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
