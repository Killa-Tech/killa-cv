import compilerWasmUrl from '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url'
import rendererWasmUrl from '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url'
import liberationSansRegularUrl from '@/assets/fonts/liberation/LiberationSans-Regular.ttf?url'
import liberationSansBoldUrl from '@/assets/fonts/liberation/LiberationSans-Bold.ttf?url'
import liberationSansItalicUrl from '@/assets/fonts/liberation/LiberationSans-Italic.ttf?url'
import { $typst, TypstSnippet } from '@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs'
import cvEngineSource from '@/assets/cv-engine.typ?raw'
import { sanitizeCVData, type CVData, type FormatoPapel, type PlantillaTipo } from '@/domain/cv'
import type { TypstCompileSVGResult } from './types'

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

let isInitialized = false
let initPromise: Promise<void> | null = null

async function initEngine(): Promise<void> {
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

async function cleanupVirtualAvatars(keepPath?: string): Promise<void> {
    for (const path of VIRTUAL_AVATAR_PATHS) {
        if (keepPath && path === keepPath) continue
        try {
            await $typst.unmapShadow(path)
        } catch {
            // Ignorar si no estaba mapeado
        }
    }
}

async function prepareAvatar(datosPersonales?: Record<string, unknown>): Promise<void> {
    if (!datosPersonales) return

    const rawFoto = typeof datosPersonales.foto === 'string' ? datosPersonales.foto.trim() : undefined

    if (!rawFoto) {
        delete datosPersonales.foto
        await cleanupVirtualAvatars()
        return
    }

    if (rawFoto.startsWith('data:image')) {
        try {
            const { bytes, extension } = decodeAvatarDataUri(rawFoto)
            const targetPath = `/avatar.${extension}`

            await cleanupVirtualAvatars(targetPath)
            await $typst.mapShadow(targetPath, bytes)
            datosPersonales.foto = targetPath
        } catch (err) {
            console.warn('Error al decodificar avatar en Worker:', err)
            delete datosPersonales.foto
            await cleanupVirtualAvatars()
        }
    } else if (VIRTUAL_AVATAR_PATHS.includes(rawFoto)) {
        datosPersonales.foto = rawFoto
    } else {
        delete datosPersonales.foto
        await cleanupVirtualAvatars()
    }
}

function extractPagesFromSvg(svgString: string): string[] {
    const svgTags = svgString.match(/<svg[\s\S]*?<\/svg>/gi)
    if (svgTags && svgTags.length > 1) {
        return svgTags
    }
    return [svgString]
}

async function executeCompileSVG(
    cvData: CVData,
    plantilla: PlantillaTipo,
    paper: FormatoPapel
): Promise<TypstCompileSVGResult> {
    await initEngine()

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

async function executeCompilePDF(
    cvData: CVData,
    plantilla: PlantillaTipo,
    paper: FormatoPapel
): Promise<Uint8Array> {
    await initEngine()

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

// Receptor de eventos del hilo principal
self.onmessage = async (event: MessageEvent) => {
    const { id, type, payload } = event.data

    try {
        if (type === 'init') {
            await initEngine()
            self.postMessage({ id, ok: true, version: 'Typst WASM 0.15' })
        } else if (type === 'compileSVG') {
            const result = await executeCompileSVG(payload.cvData, payload.plantilla, payload.paper)
            self.postMessage({ id, ok: true, result })
        } else if (type === 'compilePDF') {
            const pdfBytes = await executeCompilePDF(payload.cvData, payload.plantilla, payload.paper)
            // Transferencia Zero-Copy del buffer binario para máximo rendimiento
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
