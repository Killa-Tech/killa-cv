import * as React from 'react'

export interface UsePreviewZoomReturn {
  zoom: number
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  setZoom: (value: number) => void
  fitWidth: () => void
}

const MIN_ZOOM = 0.5
const MAX_ZOOM = 2.0
const ZOOM_STEP = 0.1

export function usePreviewZoom(initialZoom = 1.0): UsePreviewZoomReturn {
  const [zoom, setZoomState] = React.useState<number>(initialZoom)

  const setZoom = React.useCallback((value: number) => {
    const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(value.toFixed(2))))
    setZoomState(clamped)
  }, [])

  const zoomIn = React.useCallback(() => {
    setZoomState((prev) => Math.min(MAX_ZOOM, Number((prev + ZOOM_STEP).toFixed(2))))
  }, [])

  const zoomOut = React.useCallback(() => {
    setZoomState((prev) => Math.max(MIN_ZOOM, Number((prev - ZOOM_STEP).toFixed(2))))
  }, [])

  const resetZoom = React.useCallback(() => {
    setZoomState(1.0)
  }, [])

  const fitWidth = React.useCallback(() => {
    // Escala cómoda que ajusta el ancho de página A4/Letter a la mayoría de visores
    setZoomState(0.9)
  }, [])

  return {
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    fitWidth,
  }
}
