import * as React from 'react'
import { Download, LayoutTemplate, Sparkles, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getTypstCLICommand } from '@/services/typst-service'
import type { FormatoPapel, PlantillaTipo } from '@/types/cv'

const CliCommandDialog = React.lazy(() => import('./cli-command-dialog'))

interface PreviewToolbarProps {
  plantilla: PlantillaTipo
  onPlantillaChange: (p: PlantillaTipo) => void
  paper: FormatoPapel
  onPaperChange: (p: FormatoPapel) => void
  onDownloadPDF: () => void
  isDownloadingPDF: boolean
}

export function PreviewToolbar({
  plantilla,
  onPlantillaChange,
  paper,
  onPaperChange,
  onDownloadPDF,
  isDownloadingPDF,
}: PreviewToolbarProps) {
  const [showCliDialog, setShowCliDialog] = React.useState(false)
  const cliCommand = getTypstCLICommand(plantilla, paper)

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl border border-border/80 bg-card/80 backdrop-blur-md shadow-lg">
      <div className="flex items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-heading" />
            }
          >
            <LayoutTemplate className="size-3.5 text-primary" />
            <span>Plantilla: {plantilla === 'harvard' ? 'Harvard' : 'Modern'}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onPlantillaChange('harvard')} className="cursor-pointer text-xs">
              Harvard (Clásica Formal)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPlantillaChange('modern')} className="cursor-pointer text-xs">
              Modern (Con Avatar & Color)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-heading" />
            }
          >
            <span>Papel: {paper.toUpperCase()}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onPaperChange('a4')} className="cursor-pointer text-xs">
              A4 (210 × 297 mm)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPaperChange('us-letter')} className="cursor-pointer text-xs">
              US Letter (8.5 × 11 in)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowCliDialog(true)}
          className="h-8 gap-1 text-xs text-muted-foreground"
          title="Ver comando de compilación Typst"
        >
          <Terminal className="size-3.5" />
          <span className="hidden md:inline">CLI</span>
        </Button>

        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={onDownloadPDF}
          disabled={isDownloadingPDF}
          className="h-8 gap-1.5 text-xs shadow-cyan-glow"
        >
          {isDownloadingPDF ? (
            <>
              <Sparkles className="size-3.5 animate-spin" />
              <span>Generando...</span>
            </>
          ) : (
            <>
              <Download className="size-3.5" />
              <span>Descargar PDF</span>
            </>
          )}
        </Button>
      </div>

      {showCliDialog && (
        <React.Suspense fallback={null}>
          <CliCommandDialog
            open={showCliDialog}
            onOpenChange={setShowCliDialog}
            cliCommand={cliCommand}
          />
        </React.Suspense>
      )}
    </div>
  )
}
