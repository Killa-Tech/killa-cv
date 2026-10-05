import * as React from 'react'
import { ThemeProvider } from '@/app/providers/theme-provider'
import { AppHeader } from '@/features/app-header'
import { CVEditor } from '@/features/cv-editor'
import { CVPreview } from '@/features/cv-preview'
import { useCVStore } from '@/store'
import { useTypstCompiler } from '@/features/typst-compiler'
import { Edit3, Eye } from 'lucide-react'

export function App() {
  const [mobileTab, setMobileTab] = React.useState<'editor' | 'preview'>('editor')

  const cvData = useCVStore((state) => state.cvData)
  const formatoPapel = useCVStore((state) => state.formatoPapel)
  const plantilla = cvData.plantilla || 'harvard'

  const compiler = useTypstCompiler(cvData, plantilla, formatoPapel)

  return (
    <ThemeProvider defaultTheme="dark" storageKey="killa-ui-theme">
      <div className="relative flex h-dvh flex-col overflow-hidden bg-background font-sans text-foreground">
        {/* Resplandor ambiental de fondo Cyber Lunar */}
        <div className="pointer-events-none fixed -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

        {/* Barra superior de la aplicación modular */}
        <AppHeader
          isCompiling={compiler.isCompiling}
          error={compiler.error}
          typstVersion={compiler.typstVersion}
        />

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
              <CVPreview compiler={compiler} />
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
