import { cvDataSchema } from './schema'
import type { CVData, ContactoItem, EntradaItem, GrupoItem, SeccionCV } from './types'

/**
 * Sanitiza y serializa el estado interno de CVData hacia un objeto JSON puro
 * compatible con cv.schema.json (additionalProperties: false) y el motor Typst WASM.
 *
 * Elimina IDs internos de React/Zustand, limpia viñetas vacías, formatea URLs
 * y excluye secciones o campos en blanco que puedan romper la maquetación.
 */
export function sanitizeCVData(data: CVData): Record<string, unknown> {
  // 1. Sanitizar Contactos (excluyendo IDs internos y entradas vacías)
  const contactoSanitizado = (data.datos_personales?.contacto || [])
    .filter((c: ContactoItem) => c && c.tipo && c.tipo.trim() !== '' && c.valor && c.valor.trim() !== '')
    .map((c: ContactoItem) => {
      const item: Record<string, string> = {
        tipo: c.tipo.trim(),
        valor: c.valor.trim(),
      }
      if (c.url && c.url.trim() !== '') {
        item.url = c.url.trim()
      }
      return item
    })

  // 2. Sanitizar Datos Personales
  const datosPersonales: Record<string, unknown> = {
    nombre_completo: (data.datos_personales?.nombre_completo || 'Sin Nombre').trim(),
    contacto: contactoSanitizado,
  }

  if (data.datos_personales?.titulo && data.datos_personales.titulo.trim() !== '') {
    datosPersonales.titulo = data.datos_personales.titulo.trim()
  }

  if (data.datos_personales?.foto && data.datos_personales.foto.trim() !== '') {
    datosPersonales.foto = data.datos_personales.foto.trim()
  }

  if (data.datos_personales?.fecha_nacimiento && data.datos_personales.fecha_nacimiento.trim() !== '') {
    datosPersonales.fecha_nacimiento = data.datos_personales.fecha_nacimiento.trim()
  }

  // 3. Sanitizar Secciones Polimórficas (eliminando IDs y nodos vacíos)
  const seccionesSanitizadas = (data.secciones || [])
    .map((sec: SeccionCV) => {
      const titulo = (sec.titulo || 'SECCIÓN').trim()

      if (sec.tipo === 'texto') {
        const contenido = (sec.contenido || '').trim()
        if (!contenido) return null
        return {
          titulo,
          tipo: 'texto',
          contenido,
        }
      }

      if (sec.tipo === 'entradas') {
        const items = (sec.items || [])
          .map((it: EntradaItem) => {
            const entrada: Record<string, unknown> = {}
            if (it.primario_izq && it.primario_izq.trim() !== '') {
              entrada.primario_izq = it.primario_izq.trim()
            }
            if (it.primario_der && it.primario_der.trim() !== '') {
              entrada.primario_der = it.primario_der.trim()
            }
            if (it.secundario_izq && it.secundario_izq.trim() !== '') {
              entrada.secundario_izq = it.secundario_izq.trim()
            }
            if (it.secundario_der && it.secundario_der.trim() !== '') {
              entrada.secundario_der = it.secundario_der.trim()
            }
            if (it.descripcion && it.descripcion.trim() !== '') {
              entrada.descripcion = it.descripcion.trim()
            }
            const vinetas = (it.vinetas || [])
              .map((v: string) => (typeof v === 'string' ? v.trim() : ''))
              .filter((v: string) => v !== '')
            if (vinetas.length > 0) {
              entrada.vinetas = vinetas
            }
            return entrada
          })
          .filter((it: Record<string, unknown>) => Object.keys(it).length > 0)

        if (items.length === 0) return null

        return {
          titulo,
          tipo: 'entradas',
          items,
        }
      }

      if (sec.tipo === 'agrupado') {
        const grupos = (sec.grupos || [])
          .map((g: GrupoItem) => {
            const elementos = (g.elementos || [])
              .map((e: string) => (typeof e === 'string' ? e.trim() : ''))
              .filter((e: string) => e !== '')
            return {
              categoria: (g.categoria || 'General').trim(),
              elementos,
            }
          })
          .filter((g: { categoria: string; elementos: string[] }) => g.categoria !== '' || g.elementos.length > 0)

        if (grupos.length === 0) return null

        return {
          titulo,
          tipo: 'agrupado',
          grupos,
        }
      }

      if (sec.tipo === 'lista') {
        const elementos = (sec.elementos || [])
          .map((e: string) => (typeof e === 'string' ? e.trim() : ''))
          .filter((e: string) => e !== '')

        if (elementos.length === 0) return null

        return {
          titulo,
          tipo: 'lista',
          elementos,
        }
      }

      return null
    })
    .filter(Boolean)

  return {
    $schema: 'assets/cv.schema.json',
    plantilla: data.plantilla || 'harvard',
    datos_personales: datosPersonales,
    secciones: seccionesSanitizadas,
  }
}

/**
 * Valida y transforma un payload JSON crudo (ej: desde un archivo importado o localStorage)
 * hacia la estructura tipada CVData garantizando IDs únicos y saneamiento de esquema.
 */
export function parseAndValidateCVData(raw: unknown): {
  success: true
  data: CVData
} | {
  success: false
  error: string
} {
  try {
    const result = cvDataSchema.safeParse(raw)
    if (!result.success) {
      const errorMsg = result.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('; ')
      return { success: false, error: errorMsg }
    }
    return { success: true, data: result.data }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Error inesperado al validar estructura JSON',
    }
  }
}
