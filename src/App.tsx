import { ThemeProvider } from '@/app/providers/theme-provider'
import { AppHeader } from '@/features/app-header'
import { CVEditor } from '@/features/cv-editor'
import { CVPreview } from '@/features/cv-preview'
import { Edit3, Eye } from 'lucide-react'
import { useState } from 'react'
import { useMediaQuery } from '@/core/hooks'

export function App() {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor')
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const showPreview = isDesktop || activeTab === 'preview'
  return (
    <ThemeProvider defaultTheme="dark" storageKey="killa-ui-theme">
      <div className="relative flex h-dvh flex-col overflow-hidden bg-background font-sans text-foreground">
        {/* Resplandor ambiental de fondo Cyber Lunar */}
        <div className="pointer-events-none fixed -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

        {/* Encabezado global */}
        <AppHeader />

        {/* Barra de pestañas móvil (< lg) */}
        <div className="lg:hidden shrink-0 px-3 pt-2">
          <div className="grid grid-cols-2 p-1 rounded-lg bg-surface-container-low/70 border border-border/60">
            {(['editor', 'preview'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`py-1.5 text-xs font-heading font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${activeTab === tab ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {tab === 'editor' ? <Edit3 className="size-3.5" /> : <Eye className="size-3.5" />}
                <span>{tab === 'editor' ? 'Editor de CV' : 'Vista Previa'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Workbench: Dos columnas en Desktop (lg+), pestañas en Mobile */}
        <main className="flex-1 min-h-0 w-full max-w-[1920px] mx-auto p-3 sm:p-4 overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-4 lg:gap-6 h-full min-h-0">
            <div className={`lg:col-span-5 xl:col-span-5 h-full min-h-0 overflow-y-auto pr-1 sm:pr-2 scrollbar-thin ${activeTab === 'editor' ? 'flex flex-col' : 'hidden lg:flex flex-col'
              }`}>
              <CVEditor />
            </div>

            <div className={`lg:col-span-7 xl:col-span-7 h-full min-h-0 ${activeTab === 'preview' ? 'flex flex-col' : 'hidden lg:flex flex-col'
              }`}>
              {showPreview && <CVPreview />}

            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
