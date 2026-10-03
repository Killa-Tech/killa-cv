import * as React from 'react'
import { Download, LayoutTemplate, Sparkles, Terminal, FileOutput } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
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
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl border border-border/80 bg-card/80 backdrop-blur-md shadow-lg">
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs font-heading text-muted-foreground hover:text-foreground">
              <LayoutTemplate className="size-3.5 text-primary" />
              <span className="hidden sm:inline">Plantilla:</span> {plantilla === 'harvard' ? 'Harvard' : 'Modern'}
            </Button>
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

        <Separator orientation="vertical" className="h-4 mx-0.5 hidden sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs font-heading text-muted-foreground hover:text-foreground">
              <span className="hidden sm:inline">Papel:</span> {paper.toUpperCase()}
            </Button>
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

      <div className="flex items-center gap-1.5 pr-1">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowCliDialog(true)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Terminal className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ver comando CLI de Typst</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-4 mx-0.5" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="default"
                size="sm"
                disabled={isDownloadingPDF}
                className="h-8 gap-1.5 text-xs shadow-cyan-glow"
              >
                {isDownloadingPDF ? (
                  <Sparkles className="size-3.5 animate-spin" />
                ) : (
                  <FileOutput className="size-3.5" />
                )}
                <span>Exportar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDownloadPDF} disabled={isDownloadingPDF} className="cursor-pointer text-xs gap-2">
                <Download className="size-3.5" />
                <span>Descargar PDF</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
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
