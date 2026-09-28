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

interface PreviewHeaderProps {
  isCompiling: boolean
  error?: string
  typstVersion?: string
  currentPage: number
  totalPages: number
  zoomLevel: number
  onPageChange: (page: number) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
}

export function PreviewHeader({
  isCompiling,
  error,
  typstVersion,
  currentPage,
  totalPages,
  zoomLevel,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}: PreviewHeaderProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-border/40 bg-surface-container-low/60 text-xs">
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

      <div className="flex items-center gap-2">
        {totalPages > 1 && (
          <div className="flex items-center gap-1 bg-surface-container/70 rounded-md p-0.5 border border-border/40">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              className="size-5"
            >
              <ChevronLeft className="size-3" />
            </Button>
            <span className="text-[11px] font-mono px-1">
              {currentPage} / {totalPages}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
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
            onClick={onZoomOut}
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
            onClick={onZoomIn}
            title="Aumentar zoom"
            className="size-5"
          >
            <ZoomIn className="size-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onResetZoom}
            title="Restablecer 100%"
            className="size-5"
          >
            <Maximize2 className="size-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
