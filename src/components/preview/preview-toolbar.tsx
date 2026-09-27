import * as React from 'react'
import {
  Check,
  Copy,
  Download,
  LayoutTemplate,
  Sparkles,
  Terminal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getTypstCLICommand } from '@/services/typst-service'
import type { FormatoPapel, PlantillaTipo } from '@/types/cv'

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
  const [copiedCLI, setCopiedCLI] = React.useState(false)

  const cliCommand = getTypstCLICommand(plantilla, paper)

  const handleCopyCLI = () => {
    navigator.clipboard.writeText(cliCommand)
    setCopiedCLI(true)
    setTimeout(() => setCopiedCLI(false), 2000)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl border border-border/80 bg-card/80 backdrop-blur-md shadow-lg">
      {/* Opciones de diseño: Plantilla y Papel */}
      <div className="flex items-center gap-1.5">
        {/* Selector de Plantilla */}
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
            <DropdownMenuItem
              onClick={() => onPlantillaChange('harvard')}
              className="cursor-pointer justify-between text-xs"
            >
              <span>Harvard (Clásica Formal)</span>
              {plantilla === 'harvard' && <Check className="size-3.5 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onPlantillaChange('modern')}
              className="cursor-pointer justify-between text-xs"
            >
              <span>Modern (Con Avatar & Color)</span>
              {plantilla === 'modern' && <Check className="size-3.5 text-primary" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Selector de Papel */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-heading" />
            }
          >
            <span>Papel: {paper.toUpperCase()}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => onPaperChange('a4')}
              className="cursor-pointer justify-between text-xs"
            >
              <span>A4 (210 × 297 mm)</span>
              {paper === 'a4' && <Check className="size-3.5 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onPaperChange('us-letter')}
              className="cursor-pointer justify-between text-xs"
            >
              <span>US Letter (8.5 × 11 in)</span>
              {paper === 'us-letter' && <Check className="size-3.5 text-primary" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Acciones de Documento: CLI y Descarga de PDF */}
      <div className="flex items-center gap-1.5">
        {/* Modal Comando CLI */}
        <Dialog>
          <DialogTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 text-xs text-muted-foreground"
                title="Ver comando de compilación Typst"
              />
            }
          >
            <Terminal className="size-3.5" />
            <span className="hidden md:inline">CLI</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-card/95 border-border/80">
            <DialogHeader>
              <DialogTitle className="font-heading text-base flex items-center gap-2">
                <Terminal className="size-4 text-primary" />
                Compilación con Typst CLI
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Puedes compilar este CV directamente en tu terminal de Linux con el siguiente comando:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="relative p-3 rounded-lg bg-surface-container-lowest border border-border/60 font-mono text-xs text-primary overflow-x-auto">
                <code>{cliCommand}</code>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyCLI}
                className="w-full gap-1.5 text-xs"
              >
                {copiedCLI ? (
                  <>
                    <Check className="size-3.5 text-primary" />
                    ¡Comando Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    Copiar Comando
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Botón Principal: Descargar PDF */}
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
    </div>
  )
}
