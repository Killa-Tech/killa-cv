import { Badge } from '@/core/ui/badge'
import { Button } from '@/core/ui/button'
import { useCVStore } from '@/store'
import { exportDocumentJSON, ImportJsonDialog } from '@/features/document-storage'
import { CompilerStatusBadge } from './compiler-status-badge'
import { ThemeToggle } from './theme-toggle'
import {
  FileUp,
  FileDown,
  RotateCcw,
  Trash2,
  MoonStar,
} from 'lucide-react'
import { useState } from 'react'


export function AppHeader() {
  const resetToDefault = useCVStore((state) => state.resetToDefault)
  const clearData = useCVStore((state) => state.clearData)

  const [isImportOpen, setIsImportOpen] = useState(false);

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

  const handleExport = () => {
    const cvData = useCVStore.getState().cvData
    exportDocumentJSON(cvData)
  }

  return (
    <>
      <header className="shrink-0 z-20 border-b border-border/60 bg-surface-container-lowest/80 backdrop-blur-md px-3 sm:px-6 py-2">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-3">
          {/* Logo y versión */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-7 rounded-lg bg-primary/10 text-primary border border-primary/25 shadow-cyan-glow">
                <MoonStar className="size-4" />
              </div>
              <h1 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
                Killa CV
              </h1>
              <Badge
                variant="outline"
                className="border-primary/40 text-primary font-mono text-[9px] uppercase tracking-wider"
              >
                v2.2
              </Badge>
            </div>

            <CompilerStatusBadge />
          </div>

          {/* Acciones principales del encabezado */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Importar JSON */}
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => setIsImportOpen(true)}
              className="gap-1 text-xs text-muted-foreground hover:text-foreground h-7 px-2 sm:px-2.5"
              title="Importar CV desde un archivo JSON"
            >
              <FileUp className="size-3 text-primary" />
              <span className="hidden sm:inline">Importar JSON</span>
            </Button>

            {/* Exportar JSON */}
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleExport}
              className="gap-1 text-xs text-muted-foreground hover:text-foreground h-7 px-2 sm:px-2.5"
              title="Exportar archivo JSON limpio"
            >
              <FileDown className="size-3 text-primary" />
              <span className="hidden sm:inline">Exportar JSON</span>
            </Button>

            <span className="text-border/70 text-xs hidden sm:inline">|</span>

            {/* Restablecer perfil de ejemplo */}
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={handleReset}
              className="gap-1 text-xs text-muted-foreground hover:text-foreground h-7 px-2"
              title="Restablecer con el perfil de ejemplo (John Doe)"
            >
              <RotateCcw className="size-3" />
              <span className="hidden md:inline">Reiniciar ejemplo</span>
            </Button>

            {/* Vaciar documento */}
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={handleClear}
              className="gap-1 text-xs text-destructive hover:bg-destructive/10 h-7 px-2"
              title="Vaciar todos los campos"
            >
              <Trash2 className="size-3" />
              <span className="hidden md:inline">Limpiar</span>
            </Button>

            <span className="text-border/70 text-xs">|</span>

            {/* Alternador de Tema */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Diálogo modal de importación */}
      <ImportJsonDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
    </>
  )
}
