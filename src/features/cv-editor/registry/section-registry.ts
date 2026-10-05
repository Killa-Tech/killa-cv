import type * as React from 'react'
import type { SeccionCV, SectionEditorProps, TipoSeccion } from '@/domain/cv'
import { TextSectionEditor } from '../sections/text-section/text-section-editor'
import { EntriesSectionEditor } from '../sections/entries-section/entries-section-editor'
import { GroupedSectionEditor } from '../sections/grouped-section/grouped-section-editor'
import { ListSectionEditor } from '../sections/list-section/list-section-editor'

/**
 * Strategy Pattern: Registro central de componentes de edición polimórficos.
 * Elimina switch-case masivos y permite agregar nuevos tipos de sección
 * sin modificar la lógica del gestor.
 */
export const SECTION_REGISTRY: Record<
  TipoSeccion,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.ComponentType<SectionEditorProps<any>>
> = {
  texto: TextSectionEditor as React.ComponentType<SectionEditorProps<SeccionCV>>,
  entradas: EntriesSectionEditor as React.ComponentType<SectionEditorProps<SeccionCV>>,
  agrupado: GroupedSectionEditor as React.ComponentType<SectionEditorProps<SeccionCV>>,
  lista: ListSectionEditor as React.ComponentType<SectionEditorProps<SeccionCV>>,
}

export const SECTION_TYPE_METADATA: Record<
  TipoSeccion,
  { label: string; badgeColor: string; description: string }
> = {
  texto: {
    label: 'Texto Narrativo',
    badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
    description: 'Párrafos continuos para perfil profesional u objetivos.',
  },
  entradas: {
    label: 'Cronología Harvard',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    description: 'Experiencia laboral, educación y proyectos con viñetas.',
  },
  agrupado: {
    label: 'Habilidades & Chips',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    description: 'Grupos temáticos con etiquetas interactivas.',
  },
  lista: {
    label: 'Lista de Viñetas',
    badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    description: 'Viñetas simples para certificaciones, cursos y logros.',
  },
}
