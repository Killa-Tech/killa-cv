import { $typst } from '@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs'

export interface DecodedAvatar {
  bytes: Uint8Array
  extension: 'jpg' | 'png' | 'webp' | 'gif'
}

export const VIRTUAL_AVATAR_PATHS = [
  '/avatar.png',
  '/avatar.jpg',
  '/avatar.jpeg',
  '/avatar.webp',
  '/avatar.gif',
]

/**
 * Decodifica Data URI a Uint8Array y detecta extensión real mediante magic bytes.
 */
export function decodeAvatarDataUri(dataUri: string): DecodedAvatar {
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

  // Comprobación de magic bytes binarios
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

export async function cleanupVirtualAvatars(keepPath?: string): Promise<void> {
  for (const path of VIRTUAL_AVATAR_PATHS) {
    if (keepPath && path === keepPath) continue
    try {
      await $typst.unmapShadow(path)
    } catch {
      // Ignorar si no estaba mapeado
    }
  }
}

export async function prepareAvatar(datosPersonales?: Record<string, unknown>): Promise<void> {
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
