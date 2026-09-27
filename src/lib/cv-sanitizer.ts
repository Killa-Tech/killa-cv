import type { CVData, ContactoItem, EntradaItem, GrupoItem, SeccionCV } from '@/types/cv'

/**
 * Sanitiza y serializa los datos de CVData eliminando ids internos y limpiando
 * campos vacíos o inconsistentes para respetar cv.schema.json con additionalProperties: false.
 */
export function sanitizeCVData(data: CVData): Record<string, unknown> {
  // 1. Sanitizar Contactos
  const contactoSanitizado = (data.datos_personales?.contacto || [])
    .filter((c) => c && c.tipo && c.tipo.trim() !== '' && c.valor && c.valor.trim() !== '')
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
  if (
    data.datos_personales?.fecha_nacimiento &&
    data.datos_personales.fecha_nacimiento.trim() !== ''
  ) {
    datosPersonales.fecha_nacimiento = data.datos_personales.fecha_nacimiento.trim()
  }

  // 3. Sanitizar Secciones
  const seccionesSanitizadas = (data.secciones || [])
    .map((sec: SeccionCV) => {
      const titulo = (sec.titulo || 'SECCIÓN').trim().toUpperCase()

      if (sec.tipo === 'texto') {
        return {
          titulo,
          tipo: 'texto',
          contenido: sec.contenido || '',
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
              .map((v) => (typeof v === 'string' ? v.trim() : ''))
              .filter((v) => v !== '')
            if (vinetas.length > 0) {
              entrada.vinetas = vinetas
            }
            return entrada
          })
          .filter((it) => Object.keys(it).length > 0)

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
              .map((e) => (typeof e === 'string' ? e.trim() : ''))
              .filter((e) => e !== '')
            return {
              categoria: (g.categoria || 'General').trim(),
              elementos,
            }
          })
          .filter((g) => g.categoria !== '' || g.elementos.length > 0)

        return {
          titulo,
          tipo: 'agrupado',
          grupos,
        }
      }

      if (sec.tipo === 'lista') {
        const elementos = (sec.elementos || [])
          .map((e) => (typeof e === 'string' ? e.trim() : ''))
          .filter((e) => e !== '')
        return {
          titulo,
          tipo: 'lista',
          elementos,
        }
      }

      return null
    })
    .filter(Boolean)

  const resultado: Record<string, unknown> = {
    $schema: 'assets/cv.schema.json',
    plantilla: data.plantilla || 'harvard',
    datos_personales: datosPersonales,
    secciones: seccionesSanitizadas,
  }

  return resultado
}
