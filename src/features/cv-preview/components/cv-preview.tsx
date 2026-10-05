import { useCVStore } from '@/store'
import { useTypstCompiler } from '@/features/typst-compiler'
import { PreviewToolbar } from './preview-toolbar'
import { PreviewCanvas } from './preview-canvas'
import { usePreviewZoom } from '../hooks/use-preview-zoom'

interface CVPreviewProps {
  className?: string
}

export function CVPreview({ className = '' }: CVPreviewProps) {
  const cvData = useCVStore((state) => state.cvData)
  const formatoPapel = useCVStore((state) => state.formatoPapel)
  const setPlantilla = useCVStore((state) => state.setPlantilla)
  const setFormatoPapel = useCVStore((state) => state.setFormatoPapel)

  const plantilla = cvData.plantilla || 'harvard'

  const {
    pages,
    totalPages,
    isCompiling,
    error,
    isDownloadingPDF,
    downloadPDF,
    recompile,
  } = useTypstCompiler(cvData, plantilla, formatoPapel)

  const {
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    fitWidth,
  } = usePreviewZoom(1.0)

  return (
    <div className={`flex flex-col h-full min-h-0 overflow-hidden ${className}`}>
      {/* Barra de herramientas superior */}
      <div className="shrink-0 mb-3">
        <PreviewToolbar
          plantilla={plantilla}
          onPlantillaChange={setPlantilla}
          paper={formatoPapel}
          onPaperChange={setFormatoPapel}
          zoom={zoom}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
          onFitWidth={fitWidth}
          isCompiling={isCompiling}
          isDownloadingPDF={isDownloadingPDF}
          onDownloadPDF={downloadPDF}
          onRecompile={recompile}
        />
      </div>

      {/* Área de Canvas de Visualización */}
      <div className="flex-1 min-h-0 rounded-xl border border-border/60 bg-surface-container-lowest/40 backdrop-blur-xs overflow-hidden flex flex-col">
        <PreviewCanvas
          pages={pages}
          totalPages={totalPages}
          isCompiling={isCompiling}
          error={error}
          zoom={zoom}
        />
      </div>
    </div>
  )
}
