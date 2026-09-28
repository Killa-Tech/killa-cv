import { EntriesSectionEditor } from '@/components/editor/sections/entries-section-editor'
import { GroupedSectionEditor } from '@/components/editor/sections/grouped-section-editor'
import { ListSectionEditor } from '@/components/editor/sections/list-section-editor'
import { TextSectionEditor } from '@/components/editor/sections/text-section-editor'
import { CardContent } from '@/components/ui/card'
import type { SeccionCV } from '@/types/cv'

interface SectionContentEditorProps {
  section: SeccionCV
  onChange: (updated: SeccionCV) => void
}

export function SectionContentEditor({ section, onChange }: SectionContentEditorProps) {
  return (
    <CardContent className="p-3 pt-2">
      {section.tipo === 'texto' && (
        <TextSectionEditor
          section={section}
          onChange={(updated) => onChange(updated)}
        />
      )}
      {section.tipo === 'entradas' && (
        <EntriesSectionEditor
          section={section}
          onChange={(updated) => onChange(updated)}
        />
      )}
      {section.tipo === 'agrupado' && (
        <GroupedSectionEditor
          section={section}
          onChange={(updated) => onChange(updated)}
        />
      )}
      {section.tipo === 'lista' && (
        <ListSectionEditor
          section={section}
          onChange={(updated) => onChange(updated)}
        />
      )}
    </CardContent>
  )
}
