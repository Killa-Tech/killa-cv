import { z } from 'zod'
import { generateId } from '@/core/lib/id'

/**
 * Esquema para los tipos de plantillas visuales soportadas por el motor Typst.
 */
export const plantillaSchema = z.enum(['harvard', 'modern']).default('harvard')

/**
 * Esquema para los formatos de papel de salida.
 */
export const formatoPapelSchema = z.enum(['a4', 'us-letter']).default('a4')

/**
 * Esquema para ítems individuales de contacto (email, teléfono, linkedin, github, etc.).
 */
export const contactoItemSchema = z.object({
  id: z.string().default(() => generateId()),
  tipo: z.string().min(1, 'El tipo de contacto es obligatorio').default('email'),
  valor: z.string().default(''),
  url: z.string().optional().default(''),
})

/**
 * Esquema para la sección de datos personales y cabecera del postulante.
 */
export const datosPersonalesSchema = z.object({
  nombre_completo: z.string().default(''),
  titulo: z.string().optional().default(''),
  foto: z.string().optional(),
  fecha_nacimiento: z.string().optional(),
  contacto: z.array(contactoItemSchema).default([]),
})

/**
 * Esquema para entradas cronológicas (Experiencia, Educación, Proyectos).
 */
export const entradaItemSchema = z.object({
  id: z.string().default(() => generateId()),
  primario_izq: z.string().optional().default(''),
  primario_der: z.string().optional().default(''),
  secundario_izq: z.string().optional().default(''),
  secundario_der: z.string().optional().default(''),
  descripcion: z.string().optional().default(''),
  vinetas: z.array(z.string()).default([]),
})

/**
 * Esquema para grupos de habilidades, idiomas o categorías con etiquetas.
 */
export const grupoItemSchema = z.object({
  id: z.string().default(() => generateId()),
  categoria: z.string().default('General'),
  elementos: z.array(z.string()).default([]),
})

/**
 * Sección polimórfica: Texto continuo o Markdown (Perfil, Carta de objetivos).
 */
export const seccionTextoSchema = z.object({
  id: z.string().default(() => generateId()),
  titulo: z.string().default(''),
  tipo: z.literal('texto'),
  contenido: z.string().default(''),
})

/**
 * Sección polimórfica: Entradas cronológicas (Experiencia, Educación, etc.).
 */
export const seccionEntradasSchema = z.object({
  id: z.string().default(() => generateId()),
  titulo: z.string().default(''),
  tipo: z.literal('entradas'),
  items: z.array(entradaItemSchema).default([]),
})

/**
 * Sección polimórfica: Agrupaciones y habilidades por categorías.
 */
export const seccionAgrupadoSchema = z.object({
  id: z.string().default(() => generateId()),
  titulo: z.string().default(''),
  tipo: z.literal('agrupado'),
  grupos: z.array(grupoItemSchema).default([]),
})

/**
 * Sección polimórfica: Lista simple de viñetas (Certificaciones, Logros).
 */
export const seccionListaSchema = z.object({
  id: z.string().default(() => generateId()),
  titulo: z.string().default(''),
  tipo: z.literal('lista'),
  elementos: z.array(z.string()).default([]),
})

/**
 * Unión discriminada estricta para cualquier sección del CV.
 * Garantiza que TypeScript infiera con exactitud las propiedades según 'tipo'.
 */
export const seccionSchema = z.discriminatedUnion('tipo', [
  seccionTextoSchema,
  seccionEntradasSchema,
  seccionAgrupadoSchema,
  seccionListaSchema,
])

/**
 * Esquema raíz universal del currículum.
 */
export const cvDataSchema = z.object({
  $schema: z.string().optional().default('assets/cv.schema.json'),
  plantilla: plantillaSchema,
  datos_personales: datosPersonalesSchema,
  secciones: z.array(seccionSchema).default([]),
})
