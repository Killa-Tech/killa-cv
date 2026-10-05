import type { z } from 'zod'
import type {
  contactoItemSchema,
  cvDataSchema,
  datosPersonalesSchema,
  entradaItemSchema,
  formatoPapelSchema,
  grupoItemSchema,
  plantillaSchema,
  seccionAgrupadoSchema,
  seccionEntradasSchema,
  seccionListaSchema,
  seccionSchema,
  seccionTextoSchema,
} from './schema'

export type PlantillaTipo = z.infer<typeof plantillaSchema>
export type FormatoPapel = z.infer<typeof formatoPapelSchema>
export type TipoSeccion = 'texto' | 'entradas' | 'agrupado' | 'lista'

export type ContactoItem = z.infer<typeof contactoItemSchema>
export type DatosPersonales = z.infer<typeof datosPersonalesSchema>
export type EntradaItem = z.infer<typeof entradaItemSchema>
export type GrupoItem = z.infer<typeof grupoItemSchema>

export type SeccionTexto = z.infer<typeof seccionTextoSchema>
export type SeccionEntradas = z.infer<typeof seccionEntradasSchema>
export type SeccionAgrupado = z.infer<typeof seccionAgrupadoSchema>
export type SeccionLista = z.infer<typeof seccionListaSchema>

export type SeccionCV = z.infer<typeof seccionSchema>
export type CVData = z.infer<typeof cvDataSchema>

/**
 * Propiedades estándar para cualquier editor de sección polimórfica (Strategy Pattern)
 */
export interface SectionEditorProps<T extends SeccionCV> {
  section: T
  onUpdate: (updated: Partial<T>) => void
}

export type ParseCVResult =
  | { success: true; data: CVData }
  | { success: false; error: string }

