import {
  initTypstEngine,
  compileSvgDocument,
  compilePdfDocument,
} from './typst-compiler-core'

// Enrutador de peticiones del Worker
self.onmessage = async (event: MessageEvent) => {
  const { id, type, payload } = event.data

  try {
    if (type === 'init') {
      await initTypstEngine()
      self.postMessage({ id, ok: true, version: 'Typst WASM 0.15' })
    } else if (type === 'compileSVG') {
      const result = await compileSvgDocument(payload.cvData, payload.plantilla, payload.paper)
      self.postMessage({ id, ok: true, result })
    } else if (type === 'compilePDF') {
      const pdfBytes = await compilePdfDocument(payload.cvData, payload.plantilla, payload.paper)
      self.postMessage({ id, ok: true, pdfBytes })
    }
  } catch (err) {
    self.postMessage({
      id,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}
