import compilerWasmUrl from '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url'
import rendererWasmUrl from '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url'
import liberationSansRegularUrl from '@/assets/fonts/liberation/LiberationSans-Regular.ttf?url'
import liberationSansBoldUrl from '@/assets/fonts/liberation/LiberationSans-Bold.ttf?url'
import liberationSansItalicUrl from '@/assets/fonts/liberation/LiberationSans-Italic.ttf?url'
import { $typst, TypstSnippet } from '@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs'
import cvEngineSource from '@/assets/cv-engine.typ?raw'
import { sanitizeCVData, type CVData, type FormatoPapel, type PlantillaTipo } from '@/domain/cv'
import type { TypstCompileSVGResult } from './types'
import { prepareAvatar } from './avatar-processor'

let isInitialized = false
let initPromise: Promise<void> | null = null

export async function initTypstEngine(): Promise<void> {
  if (isInitialized) return
  if (initPromise) return initPromise

  initPromise = (async () => {
    $typst.setCompilerInitOptions({
      getModule: () => compilerWasmUrl,
    })
    $typst.setRendererInitOptions({
      getModule: () => rendererWasmUrl,
    })

    $typst.use(
      TypstSnippet.preloadFonts([
        liberationSansRegularUrl,
        liberationSansBoldUrl,
        liberationSansItalicUrl,
      ]),
      TypstSnippet.fetchPackageRegistry()
    )

    const encoder = new TextEncoder()
    await $typst.mapShadow('/cv-engine.typ', encoder.encode(cvEngineSource))

    isInitialized = true
  })()

  return initPromise
}

function extractPagesFromSvg(svgString: string): string[] {
  const svgTags = svgString.match(/<svg[\s\S]*?<\/svg>/gi)
  if (svgTags && svgTags.length > 1) {
    return svgTags
  }
  return [svgString]
}

export async function compileSvgDocument(
  cvData: CVData,
  plantilla: PlantillaTipo,
  paper: FormatoPapel
): Promise<TypstCompileSVGResult> {
  await initTypstEngine()

  const cleanData = sanitizeCVData(cvData)
  const encoder = new TextEncoder()

  const datosPersonales = cleanData.datos_personales as Record<string, unknown> | undefined
  await prepareAvatar(datosPersonales)

  const jsonStr = JSON.stringify(cleanData)
  await $typst.mapShadow('/cv.json', encoder.encode(jsonStr))

  try {
    const svgOutput = await $typst.svg({
      mainFilePath: '/cv-engine.typ',
      inputs: {
        data: '/cv.json',
        plantilla,
        paper,
      },
    })

    if (!svgOutput) {
      throw new Error('El compilador no generó salida SVG.')
    }

    const pages = extractPagesFromSvg(svgOutput)
    return {
      ok: true,
      pages,
      totalPages: pages.length,
    }
  } finally {
    try {
      await $typst.unmapShadow('/cv.json')
    } catch {
      // Ignorar si ya fue desmontado
    }
  }
}

export async function compilePdfDocument(
  cvData: CVData,
  plantilla: PlantillaTipo,
  paper: FormatoPapel
): Promise<Uint8Array> {
  await initTypstEngine()

  const cleanData = sanitizeCVData(cvData)
  const encoder = new TextEncoder()

  const datosPersonales = cleanData.datos_personales as Record<string, unknown> | undefined
  await prepareAvatar(datosPersonales)

  const jsonStr = JSON.stringify(cleanData)
  await $typst.mapShadow('/cv.json', encoder.encode(jsonStr))

  try {
    const pdfBytes = await $typst.pdf({
      mainFilePath: '/cv-engine.typ',
      inputs: {
        data: '/cv.json',
        plantilla,
        paper,
      },
    })

    if (!pdfBytes) {
      throw new Error('El compilador no generó bytes de PDF.')
    }

    return pdfBytes
  } finally {
    try {
      await $typst.unmapShadow('/cv.json')
    } catch {
      // Ignorar si ya fue desmontado
    }
  }
}
