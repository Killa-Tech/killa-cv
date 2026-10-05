import { Button } from '@/core/ui/button'
import { createGrupoItem, type SectionEditorProps, type SeccionAgrupado, type GrupoItem } from '@/domain/cv'
import { GroupCard } from './group-card'
import { Plus } from 'lucide-react'

export function GroupedSectionEditor({
  section,
  onUpdate,
}: SectionEditorProps<SeccionAgrupado>) {
  const grupos = section.grupos || []

  const handleAddGroup = () => {
    const newGroup = createGrupoItem('Nueva Categoría')
    onUpdate({ grupos: [...grupos, newGroup] })
  }

  const handleUpdateGroup = (groupId: string, patch: Partial<Omit<GrupoItem, 'id'>>) => {
    const nextGrupos = grupos.map((g) => (g.id === groupId ? { ...g, ...patch } : g))
    onUpdate({ grupos: nextGrupos })
  }

  const handleRemoveGroup = (groupId: string) => {
    const nextGrupos = grupos.filter((g) => g.id !== groupId)
    onUpdate({ grupos: nextGrupos })
  }

  return (
    <div className="space-y-3">
      {grupos.length === 0 ? (
        <div className="p-4 text-center rounded-lg border border-dashed border-border/60 text-muted-foreground text-xs space-y-2">
          <p>No hay grupos de habilidades o categorías configuradas.</p>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={handleAddGroup}
            className="gap-1.5 text-xs text-primary"
          >
            <Plus className="size-3.5" />
            Añadir Primera Categoría
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {grupos.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onUpdate={(patch) => handleUpdateGroup(group.id, patch)}
              onRemove={() => handleRemoveGroup(group.id)}
            />
          ))}

          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={handleAddGroup}
            className="w-full py-2 text-xs font-heading font-medium text-primary hover:bg-primary/10 gap-1.5 border-dashed"
          >
            <Plus className="size-3.5" />
            Añadir Nueva Categoría
          </Button>
        </div>
      )}
    </div>
  )
}
