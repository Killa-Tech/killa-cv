import * as React from 'react'
import {
  Eraser,
  FileDown,
  FileUp,
  FolderOpen,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'

interface EditorToolbarProps {
  onClearData: () => void
  onResetDefault: () => void
  onExportJSON: () => void
  onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function EditorToolbar({
  onClearData,
  onResetDefault,
  onExportJSON,
  onImportJSON,
}: EditorToolbarProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl border border-border/70 bg-card/70 backdrop-blur-md shadow-md">
      <div className="flex items-center gap-2 pl-1">
        <Sparkles className="size-4 text-primary" />
        <span className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
          Gestión
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={onImportJSON}
          className="hidden"
        />

        <TooltipProvider delayDuration={300}>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                    <FolderOpen className="size-3.5 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Importar / Exportar Datos</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="cursor-pointer text-xs gap-2">
                <FileUp className="size-3.5 text-primary" />
                <span>Importar JSON</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportJSON} className="cursor-pointer text-xs gap-2">
                <FileDown className="size-3.5 text-primary" />
                <span>Exportar JSON</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-4 mx-0.5" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onResetDefault}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cargar datos de ejemplo</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onClearData}
                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Eraser className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Vaciar todos los campos</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
