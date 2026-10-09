import { PreviewError } from './preview-error'
import { Badge } from '@/core/ui/badge'
import { Loader2 } from 'lucide-react'

interface PreviewCanvasProps {
  pages: string[]
  totalPages: number
  isCompiling: boolean
  error: string | null
  zoom: number
}

export function PreviewCanvas({
  pages,
  totalPages,
  isCompiling,
  error,
  zoom,
}: PreviewCanvasProps) {
  return (
    <div className="w-full flex-1 flex flex-col items-center gap-6 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
      {/* Alerta de error si ocurrió durante la compilación */}
      {error && <PreviewError error={error} />}

      {/* Estado vacío o de carga inicial */}
      {pages.length === 0 && (
        <div className="m-auto flex flex-col items-center justify-center p-12 text-center space-y-3">
          <Loader2 className="size-8 text-primary animate-spin" />
          <p className="text-xs font-mono text-muted-foreground">
            {isCompiling
              ? 'Compilando documento en WebAssembly por primera vez...'
              : 'Preparando motor tipográfico...'}
          </p>
        </div>
      )}

      {/* Renderizado de páginas SVG */}
      {pages.length > 0 && (
        <div
          className="flex flex-col items-center gap-8 transition-transform duration-150 origin-top"
          style={{
            transform: `scale(${zoom})`,
          }}
        >
          {pages.map((svgString, index) => (
            <div key={index} className="flex flex-col items-center gap-2 group">
              {/* Hoja de Papel con sombra hiperrealista */}
              <div
                className="w-full max-w-[800px] min-w-[320px] rounded-sm shadow-[0_12px_40px_rgba(0,0,0,0.55)] border border-border/80 bg-white overflow-hidden transition-all duration-200 select-none [&_svg]:w-full [&_svg]:h-auto [&_svg]:block"
                dangerouslySetInnerHTML={{ __html: svgString }}
              />

              {/* Indicador de número de página */}
              <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                <Badge
                  variant="outline"
                  className="bg-surface-container-high/60 border-border/60 text-muted-foreground font-mono text-[10px] px-2 py-0.5"
                >
                  Página {index + 1} de {totalPages}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

