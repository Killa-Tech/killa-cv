import * as React from 'react'
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  RefreshCw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface TypstPreviewProps {
  pages: string[]
  totalPages: number
  isCompiling: boolean
  error?: string
  typstVersion?: string
}

export function TypstPreview({
  pages,
  totalPages,
  isCompiling,
  error,
  typstVersion,
}: TypstPreviewProps) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [zoomLevel, setZoomLevel] = React.useState(100) // 75, 100, 125, etc.

  const safePage = totalPages > 0 ? Math.min(Math.max(currentPage, 1), totalPages) : 1

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 15, 160))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 15, 60))
  }

  const handleResetZoom = () => {
    setZoomLevel(100)
  }

  const activeSvg = pages[safePage - 1] || ''

  return (
    <div className="flex flex-col h-full rounded-xl border border-border/80 bg-surface-container-lowest/80 backdrop-blur-md overflow-hidden">
      {/* Barra superior de estado y zoom */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/40 bg-surface-container-low/60 text-xs">
        {/* Estado del motor */}
        <div className="flex items-center gap-2">
          {isCompiling ? (
            <Badge variant="outline" className="gap-1.5 py-0.5 text-[11px] border-primary/40 bg-primary/10 text-primary">
              <RefreshCw className="size-3 animate-spin" />
              Compilando Typst...
            </Badge>
          ) : error ? (
            <Badge variant="destructive" className="gap-1.5 py-0.5 text-[11px]">
              <AlertTriangle className="size-3" />
              Error de Maquetación
            </Badge>
          ) : (
            <Badge variant="cyber" className="gap-1.5 py-0.5 text-[11px]">
              <span className="size-1.5 rounded-full bg-primary inline-block" />
              En Vivo // {typstVersion || 'Typst 0.15'}
            </Badge>
          )}
        </div>

        {/* Paginación y Controles de Zoom */}
        <div className="flex items-center gap-2">
          {totalPages > 1 && (
            <div className="flex items-center gap-1 bg-surface-container/70 rounded-md p-0.5 border border-border/40">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="size-5"
              >
                <ChevronLeft className="size-3" />
              </Button>
              <span className="text-[11px] font-mono px-1">
                {safePage} / {totalPages}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="size-5"
              >
                <ChevronRight className="size-3" />
              </Button>
            </div>
          )}

          <div className="flex items-center gap-0.5 bg-surface-container/70 rounded-md p-0.5 border border-border/40">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={handleZoomOut}
              title="Reducir zoom"
              className="size-5"
            >
              <ZoomOut className="size-3" />
            </Button>
            <span className="text-[10px] font-mono px-1 min-w-[32px] text-center">
              {zoomLevel}%
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={handleZoomIn}
              title="Aumentar zoom"
              className="size-5"
            >
              <ZoomIn className="size-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={handleResetZoom}
              title="Restablecer 100%"
              className="size-5"
            >
              <Maximize2 className="size-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Área de Visualización */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-start justify-center bg-[#070b14]/90 min-h-[500px]">
        {error ? (
          <div className="w-full max-w-md p-4 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive-foreground space-y-2">
            <div className="flex items-center gap-2 font-heading font-semibold text-xs text-destructive">
              <AlertTriangle className="size-4" />
              <span>DIAGNÓSTICO DEL COMPILADOR TYPST</span>
            </div>
            <pre className="text-[11px] font-mono whitespace-pre-wrap overflow-x-auto p-2 rounded bg-black/40 text-destructive/90 max-h-60">
              {error}
            </pre>
            <p className="text-[11px] text-muted-foreground">
              Revisa los campos del formulario para corregir el valor inválido.
            </p>
          </div>
        ) : activeSvg ? (
          <div
            className="transition-transform duration-150 origin-top flex justify-center"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {/* Hoja de papel realista con sombra */}
            <div
              className="bg-white rounded-sm shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_20px_rgba(0,0,0,0.5)] overflow-hidden text-neutral-900 border border-neutral-300/40"
              style={{
                maxWidth: '100%',
              }}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Typst produces trusted local vector SVG
              dangerouslySetInnerHTML={{ __html: activeSvg }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground space-y-2">
            <RefreshCw className="size-6 animate-spin text-primary" />
            <p className="text-xs">Inicializando motor de renderizado Typst...</p>
          </div>
        )}
      </div>
    </div>
  )
}
