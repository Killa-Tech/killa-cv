import { Plus } from 'lucide-react'
import { GroupItemCard } from './grouped/group-item-card'
import { Button } from '@/components/ui/button'
import { createGrupoItem } from '@/lib/cv-defaults'
import type { GrupoItem, SeccionAgrupado } from '@/types/cv'

interface GroupedSectionEditorProps {
  section: SeccionAgrupado
  onChange: (updated: SeccionAgrupado) => void
}

export function GroupedSectionEditor({ section, onChange }: GroupedSectionEditorProps) {
  const handleGroupChange = (index: number, updatedGroup: GrupoItem) => {
    const next = [...section.grupos]
    next[index] = updatedGroup
    onChange({
      ...section,
      grupos: next,
    })
  }

  const handleAddGroup = () => {
    onChange({
      ...section,
      grupos: [...section.grupos, createGrupoItem('Nueva Categoría')],
    })
  }

  const handleRemoveGroup = (index: number) => {
    onChange({
      ...section,
      grupos: section.grupos.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-4 pt-1">
      {section.grupos.map((grupo, gIdx) => (
        <GroupItemCard
          key={grupo.id || gIdx}
          grupo={grupo}
          onChange={(updated) => handleGroupChange(gIdx, updated)}
          onRemove={() => handleRemoveGroup(gIdx)}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddGroup}
        className="w-full gap-1.5 text-xs border-dashed border-border/80 hover:border-primary text-muted-foreground hover:text-primary"
      >
        <Plus className="size-3.5" />
        Añadir Categoría / Grupo
      </Button>
    </div>
  )
}
