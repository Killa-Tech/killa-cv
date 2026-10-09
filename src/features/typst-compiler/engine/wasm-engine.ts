import compilerWasmUrl from '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url'
import rendererWasmUrl from '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url'
import liberationSansRegularUrl from '@/assets/fonts/liberation/LiberationSans-Regular.ttf?url'
import liberationSansBoldUrl from '@/assets/fonts/liberation/LiberationSans-Bold.ttf?url'
import liberationSansItalicUrl from '@/assets/fonts/liberation/LiberationSans-Italic.ttf?url'
import { $typst, TypstSnippet } from '@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs'
import cvEngineSource from '@/assets/cv-engine.typ?raw'
import { sanitizeCVData, type CVData, type FormatoPapel, type PlantillaTipo } from '@/domain/cv'
import type {
  TypstCompilerEngine,
  TypstCompileSVGResult,
  TypstStatusResult,
} from './types'

interface DecodedAvatar {
  bytes: Uint8Array
  extension: 'jpg' | 'png' | 'webp' | 'gif'
}

const VIRTUAL_AVATAR_PATHS = [
  '/avatar.png',
  '/avatar.jpg',
  '/avatar.jpeg',
  '/avatar.webp',
  '/avatar.gif',
]

/**
 * Decodifica un Data URI de imagen a binario (Uint8Array) y determina su extensión
 * real tanto por cabecera MIME como por los bytes mágicos de la firma binaria.
 */
function decodeAvatarDataUri(dataUri: string): DecodedAvatar {
  let extension: 'jpg' | 'png' | 'webp' | 'gif' = 'png'

  const mimeMatch = dataUri.match(/^data:image\/([a-zA-Z0-9+]+);base64,/)
  if (mimeMatch) {
    const subtype = mimeMatch[1].toLowerCase()
    if (subtype === 'jpeg' || subtype === 'jpg') {
      extension = 'jpg'
    } else if (subtype === 'webp') {
      extension = 'webp'
    } else if (subtype === 'gif') {
      extension = 'gif'
    } else if (subtype === 'png') {
      extension = 'png'
    }
  }

  const base64Part = dataUri.split(',')[1] || ''
  const cleanBase64 = base64Part.replace(/[\r\n\s]/g, '')
  const binary = atob(cleanBase64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  // Comprobación de seguridad mediante magic bytes reales del archivo
  if (bytes.length >= 4) {
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      extension = 'jpg'
    } else if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
      extension = 'png'
    } else if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
      extension = 'webp'
    } else if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
      extension = 'gif'
    }
  }

  return { bytes, extension }
}

class WasmTypstEngine implements TypstCompilerEngine {
  private isInitialized = false
  private initPromise: Promise<void> | null = null

  async init(): Promise<void> {
    if (this.isInitialized) return
    if (this.initPromise) return this.initPromise

    this.initPromise = (async () => {
      // 1. Configurar módulos WebAssembly desde URLs de assets estáticos de Vite
      $typst.setCompilerInitOptions({
        getModule: () => compilerWasmUrl,
      })
      $typst.setRendererInitOptions({
        getModule: () => rendererWasmUrl,
      })

      // 2. Precargar fuentes Liberation Sans y habilitar Package Registry oficial de Typst Universe
      $typst.use(
        TypstSnippet.preloadFonts([
          liberationSansRegularUrl,
          liberationSansBoldUrl,
          liberationSansItalicUrl,
        ]),
        TypstSnippet.fetchPackageRegistry()
      )

      // 3. Mapear el template principal en el sistema de archivos virtual
      const encoder = new TextEncoder()
      await $typst.mapShadow('/cv-engine.typ', encoder.encode(cvEngineSource))

      this.isInitialized = true
    })()

    return this.initPromise
  }

  async checkStatus(): Promise<TypstStatusResult> {
    try {
      await this.init()
      return {
        ok: true,
        version: 'Typst WASM 0.15',
      }
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      }
    }
  }

  private async prepareAvatar(datosPersonales?: Record<string, unknown>): Promise<void> {
    if (!datosPersonales) return

    const rawFoto = typeof datosPersonales.foto === 'string' ? datosPersonales.foto.trim() : undefined

    if (!rawFoto) {
      delete datosPersonales.foto
      await this.cleanupVirtualAvatars()
      return
    }

    if (rawFoto.startsWith('data:image')) {
      try {
        const { bytes, extension } = decodeAvatarDataUri(rawFoto)
        const targetPath = `/avatar.${extension}`

        // Limpiar cualquier otra variante previa para evitar colisiones
        await this.cleanupVirtualAvatars(targetPath)

        // Mapear los bytes con su extensión real correspondiente (ej. /avatar.jpg, /avatar.png, /avatar.webp)
        await $typst.mapShadow(targetPath, bytes)
        datosPersonales.foto = targetPath
      } catch (err) {
        console.warn('Advertencia: No se pudo decodificar el avatar en Base64. Se omitirá para evitar error de compilación:', err)
        delete datosPersonales.foto
        await this.cleanupVirtualAvatars()
      }
    } else if (VIRTUAL_AVATAR_PATHS.includes(rawFoto)) {
      datosPersonales.foto = rawFoto
    } else {
      console.warn('Advertencia: La foto no es un Data URI resoluble en el navegador. Se omitirá:', rawFoto)
      delete datosPersonales.foto
      await this.cleanupVirtualAvatars()
    }
  }

  private async cleanupVirtualAvatars(keepPath?: string): Promise<void> {
    for (const path of VIRTUAL_AVATAR_PATHS) {
      if (keepPath && path === keepPath) continue
      try {
        await $typst.unmapShadow(path)
      } catch {
        // Ignorar si el archivo no estaba previamente mapeado
      }
    }
  }

  async compileSVG(
    cvData: CVData,
    plantilla: PlantillaTipo = 'harvard',
    paper: FormatoPapel = 'a4',
    signal?: AbortSignal
  ): Promise<TypstCompileSVGResult> {
    try {
      if (signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError')
      }

      await this.init()

      if (signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError')
      }

      const cleanData = sanitizeCVData(cvData)
      const encoder = new TextEncoder()

      // Manejar foto avatar desacoplada asignando la extensión correcta
      const datosPersonales = cleanData.datos_personales as Record<string, unknown> | undefined
      await this.prepareAvatar(datosPersonales)

      const jsonStr = JSON.stringify(cleanData)
      await $typst.mapShadow('/cv.json', encoder.encode(jsonStr))

      // Compilar a SVG
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

      const pages = this.extractPagesFromSvg(svgOutput)

      return {
        ok: true,
        pages,
        totalPages: pages.length,
      }
    } catch (err: unknown) {
      if (signal?.aborted || (err as Error)?.name === 'AbortError') {
        throw err
      }
      return {
        ok: false,
        pages: [],
        totalPages: 0,
        error: err instanceof Error ? err.message : String(err),
      }
    } finally {
      // Limpiar archivo virtual de Shadow FS solo si esta compilacion no fue abortada
      if (!signal?.aborted) {
        try {
          await $typst.unmapShadow('/cv.json')
        } catch {
          // Ignorar si ya fue desmontado o no existia
        }
      }
    }
  }

  async compilePDF(
    cvData: CVData,
    plantilla: PlantillaTipo = 'harvard',
    paper: FormatoPapel = 'a4'
  ): Promise<Uint8Array> {
    await this.init()

    const cleanData = sanitizeCVData(cvData)
    const encoder = new TextEncoder()

    const datosPersonales = cleanData.datos_personales as Record<string, unknown> | undefined
    await this.prepareAvatar(datosPersonales)

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
        //ignorar si ya fue desmontado
      }
    }

  }

  private extractPagesFromSvg(svgString: string): string[] {
    const svgTags = svgString.match(/<svg[\s\S]*?<\/svg>/gi)
    if (svgTags && svgTags.length > 1) {
      return svgTags
    }
    return [svgString]
  }
}

export const wasmTypstEngine = new WasmTypstEngine()
