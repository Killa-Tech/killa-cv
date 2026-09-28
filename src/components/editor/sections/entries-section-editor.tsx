import { Plus } from 'lucide-react'
import { EntryCard } from './entries/entry-card'
import { Button } from '@/components/ui/button'
import { createEntradaItem } from '@/lib/cv-defaults'
import type { EntradaItem, SeccionEntradas } from '@/types/cv'

interface EntriesSectionEditorProps {
  section: SeccionEntradas
  onChange: (updated: SeccionEntradas) => void
}

export function EntriesSectionEditor({ section, onChange }: EntriesSectionEditorProps) {
  const handleItemChange = (index: number, updatedItem: EntradaItem) => {
    const next = [...section.items]
    next[index] = updatedItem
    onChange({
      ...section,
      items: next,
    })
  }

  const handleAddItem = () => {
    onChange({
      ...section,
      items: [...section.items, createEntradaItem()],
    })
  }

  const handleRemoveItem = (index: number) => {
    onChange({
      ...section,
      items: section.items.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-4 pt-1">
      {section.items.map((item, itemIdx) => (
        <EntryCard
          key={item.id || itemIdx}
          item={item}
          index={itemIdx}
          onChange={(updated) => handleItemChange(itemIdx, updated)}
          onRemove={() => handleRemoveItem(itemIdx)}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddItem}
        className="w-full gap-1.5 text-xs border-dashed border-border/80 hover:border-primary text-muted-foreground hover:text-primary"
      >
        <Plus className="size-3.5" />
        Añadir Otra Entrada a esta Sección
      </Button>
    </div>
  )
}
