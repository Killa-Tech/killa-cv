import { Button } from '@/core/ui/button'
import { createEntradaItem, type SectionEditorProps, type SeccionEntradas, type EntradaItem } from '@/domain/cv'
import { EntryCard } from './entry-card'
import { Plus } from 'lucide-react'

export function EntriesSectionEditor({
  section,
  onUpdate,
}: SectionEditorProps<SeccionEntradas>) {
  const items = section.items || []

  const handleAddItem = () => {
    const newItem = createEntradaItem()
    onUpdate({ items: [...items, newItem] })
  }

  const handleUpdateItem = (entryId: string, patch: Partial<Omit<EntradaItem, 'id'>>) => {
    const nextItems = items.map((it) => (it.id === entryId ? { ...it, ...patch } : it))
    onUpdate({ items: nextItems })
  }

  const handleRemoveItem = (entryId: string) => {
    const nextItems = items.filter((it) => it.id !== entryId)
    onUpdate({ items: nextItems })
  }

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <div className="p-4 text-center rounded-lg border border-dashed border-border/60 text-muted-foreground text-xs space-y-2">
          <p>No hay entradas registradas en esta sección.</p>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={handleAddItem}
            className="gap-1.5 text-xs text-primary"
          >
            <Plus className="size-3.5" />
            Añadir Primera Entrada
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((item, index) => (
            <EntryCard
              key={item.id}
              item={item}
              index={index}
              onUpdate={(patch) => handleUpdateItem(item.id, patch)}
              onRemove={() => handleRemoveItem(item.id)}
            />
          ))}

          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={handleAddItem}
            className="w-full py-2 text-xs font-heading font-medium text-primary hover:bg-primary/10 gap-1.5 border-dashed"
          >
            <Plus className="size-3.5" />
            Añadir Nueva Entrada
          </Button>
        </div>
      )}
    </div>
  )
}
