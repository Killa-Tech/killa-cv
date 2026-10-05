import { Button } from '@/core/ui/button'
import type { FormatoPapel, PlantillaTipo } from '@/domain/cv'
import {
  FileDown,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
} from 'lucide-react'

interface PreviewToolbarProps {
  plantilla: PlantillaTipo
  onPlantillaChange: (p: PlantillaTipo) => void
  paper: FormatoPapel
  onPaperChange: (f: FormatoPapel) => void
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
  onFitWidth: () => void
  isCompiling: boolean
  isDownloadingPDF: boolean
  onDownloadPDF: () => void
  onRecompile: () => void
}

export function PreviewToolbar({
  plantilla,
  onPlantillaChange,
  paper,
  onPaperChange,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitWidth,
  isCompiling,
  isDownloadingPDF,
  onDownloadPDF,
  onRecompile,
}: PreviewToolbarProps) {
  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-surface-container-low/70 border border-border/60 backdrop-blur-md">
      {/* Controles Izquierdos: Plantilla & Formato de Papel */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {/* Selector de Plantilla */}
        <div className="flex items-center p-0.5 rounded-lg bg-surface-container-high/60 border border-border/50">
          <Button
            type="button"
            variant={plantilla === 'harvard' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => onPlantillaChange('harvard')}
            className="text-[11px] h-6 px-2.5 font-medium"
          >
            Harvard
          </Button>
          <Button
            type="button"
            variant={plantilla === 'modern' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => onPlantillaChange('modern')}
            className="text-[11px] h-6 px-2.5 font-medium"
          >
            Modern
          </Button>
        </div>

        {/* Selector de Tamaño de Papel */}
        <div className="flex items-center p-0.5 rounded-lg bg-surface-container-high/60 border border-border/50">
          <Button
            type="button"
            variant={paper === 'a4' ? 'secondary' : 'ghost'}
            size="xs"
            onClick={() => onPaperChange('a4')}
            className={`text-[11px] h-6 px-2 font-mono ${
              paper === 'a4' ? 'bg-primary/15 text-primary border-primary/30' : 'text-muted-foreground'
            }`}
          >
            A4
          </Button>
          <Button
            type="button"
            variant={paper === 'us-letter' ? 'secondary' : 'ghost'}
            size="xs"
            onClick={() => onPaperChange('us-letter')}
            className={`text-[11px] h-6 px-2 font-mono ${
              paper === 'us-letter' ? 'bg-primary/15 text-primary border-primary/30' : 'text-muted-foreground'
            }`}
          >
            Letter
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={onRecompile}
          disabled={isCompiling}
          className="text-xs h-7 gap-1 text-muted-foreground hover:text-foreground"
          title="Forzar recompilación"
        >
          <RefreshCw className={`size-3 ${isCompiling ? 'animate-spin text-primary' : ''}`} />
          <span className="hidden md:inline">Recompilar</span>
        </Button>
      </div>

      {/* Controles Derechos: Zoom & Descarga de PDF */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Controles de Zoom */}
        <div className="flex items-center p-0.5 rounded-lg bg-surface-container-high/60 border border-border/50 text-xs">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onZoomOut}
            disabled={zoom <= 0.5}
            className="size-6 text-muted-foreground hover:text-foreground"
            title="Alejar (-)"
          >
            <ZoomOut className="size-3" />
          </Button>

          <button
            type="button"
            onClick={onResetZoom}
            className="px-1.5 py-0.5 font-mono text-[11px] text-foreground hover:text-primary transition-colors select-none"
            title="Restablecer al 100%"
          >
            {Math.round(zoom * 100)}%
          </button>

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onZoomIn}
            disabled={zoom >= 2.0}
            className="size-6 text-muted-foreground hover:text-foreground"
            title="Acercar (+)"
          >
            <ZoomIn className="size-3" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onFitWidth}
            className="size-6 text-muted-foreground hover:text-foreground"
            title="Ajustar al ancho"
          >
            <Maximize2 className="size-3" />
          </Button>

          {zoom !== 1.0 && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={onResetZoom}
              className="size-6 text-muted-foreground hover:text-foreground"
              title="Restablecer Zoom"
            >
              <RotateCcw className="size-3" />
            </Button>
          )}
        </div>

        {/* Botón de Descarga PDF */}
        <Button
          type="button"
          variant="default"
          size="xs"
          onClick={onDownloadPDF}
          disabled={isDownloadingPDF || isCompiling}
          className="text-xs font-heading font-semibold h-7 px-3 gap-1.5 shadow-cyan-glow"
        >
          <FileDown className="size-3.5" />
          <span>{isDownloadingPDF ? 'Generando PDF...' : 'Descargar PDF'}</span>
        </Button>
      </div>
    </div>
  )
}
