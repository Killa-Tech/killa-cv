import { RefreshCw } from 'lucide-react'

interface PreviewCanvasProps {
  activeSvg: string
  zoomLevel: number
  isCompiling: boolean
}

export function PreviewCanvas({ activeSvg, zoomLevel, isCompiling }: PreviewCanvasProps) {
  if (activeSvg) {
    return (
      <div
        className="transition-transform duration-150 origin-top flex justify-center"
        style={{ transform: `scale(${zoomLevel / 100})` }}
      >
        <div
          className="bg-white rounded-sm shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_20px_rgba(0,0,0,0.5)] overflow-hidden text-neutral-900 border border-neutral-300/40"
          style={{ maxWidth: '100%' }}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Typst produces trusted local vector SVG
          dangerouslySetInnerHTML={{ __html: activeSvg }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground space-y-2">
      <RefreshCw className={`size-6 text-primary ${isCompiling ? 'animate-spin' : ''}`} />
      <p className="text-xs">
        {isCompiling ? 'Compilando documento Typst...' : 'Esperando datos del CV...'}
      </p>
    </div>
  )
}
