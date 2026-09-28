import * as React from 'react'
import { PreviewCanvas } from './preview-canvas'
import { PreviewError } from './preview-error'
import { PreviewHeader } from './preview-header'

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
  const [zoomLevel, setZoomLevel] = React.useState(100)

  const safePage = totalPages > 0 ? Math.min(Math.max(currentPage, 1), totalPages) : 1
  const activeSvg = pages[safePage - 1] || ''

  return (
    <div className="flex flex-col h-full rounded-xl border border-border/80 bg-surface-container-lowest/80 backdrop-blur-md overflow-hidden">
      <PreviewHeader
        isCompiling={isCompiling}
        error={error}
        typstVersion={typstVersion}
        currentPage={safePage}
        totalPages={totalPages}
        zoomLevel={zoomLevel}
        onPageChange={setCurrentPage}
        onZoomIn={() => setZoomLevel((prev) => Math.min(prev + 15, 160))}
        onZoomOut={() => setZoomLevel((prev) => Math.max(prev - 15, 60))}
        onResetZoom={() => setZoomLevel(100)}
      />

      <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-start justify-center bg-[#070b14]/90 min-h-[500px]">
        {error ? (
          <PreviewError error={error} />
        ) : (
          <PreviewCanvas
            activeSvg={activeSvg}
            zoomLevel={zoomLevel}
            isCompiling={isCompiling}
          />
        )}
      </div>
    </div>
  )
}
