import * as React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { TagBadge } from './tag-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { GrupoItem } from '@/types/cv'

interface GroupItemCardProps {
  grupo: GrupoItem
  onChange: (updated: GrupoItem) => void
  onRemove: () => void
}

export function GroupItemCard({ grupo, onChange, onRemove }: GroupItemCardProps) {
  const [newTagInput, setNewTagInput] = React.useState('')

  const handleAddElement = () => {
    const val = newTagInput.trim()
    if (!val) return

    onChange({
      ...grupo,
      elementos: [...grupo.elementos, val],
    })
    setNewTagInput('')
  }

  const handleRemoveElement = (elemIdx: number) => {
    onChange({
      ...grupo,
      elementos: grupo.elementos.filter((_, i) => i !== elemIdx),
    })
  }

  return (
    <div className="p-3 rounded-lg border border-border/50 bg-surface-container-lowest/50 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 space-y-1">
          <Label className="text-[11px] text-muted-foreground">
            Categoría (ej. Frontend, Herramientas, Idiomas)
          </Label>
          <Input
            value={grupo.categoria}
            onChange={(e) => onChange({ ...grupo, categoria: e.target.value })}
            placeholder="Nombre de la categoría..."
            className="h-7 text-xs bg-background/50 font-semibold"
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onRemove}
          className="hover:text-destructive text-muted-foreground mt-4"
          title="Eliminar grupo"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      {/* Tags existentes */}
      <div className="flex flex-wrap gap-1.5 items-center min-h-[28px] p-1.5 rounded-md bg-background/40 border border-border/30">
        {grupo.elementos.map((elem, eIdx) => (
          <TagBadge
            key={eIdx}
            label={elem}
            onRemove={() => handleRemoveElement(eIdx)}
          />
        ))}

        {grupo.elementos.length === 0 && (
          <span className="text-[11px] text-muted-foreground italic">
            Sin elementos. Agrega uno abajo.
          </span>
        )}
      </div>

      {/* Input para agregar elemento rápido */}
      <div className="flex items-center gap-1.5">
        <Input
          value={newTagInput}
          onChange={(e) => setNewTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAddElement()
            }
          }}
          placeholder="Escribe una tecnología o tag y presiona Enter..."
          className="h-7 text-xs bg-background/50 flex-1"
        />
        <Button
          type="button"
          variant="secondary"
          size="xs"
          onClick={handleAddElement}
          className="h-7 text-xs gap-1"
        >
          <Plus className="size-3" />
          Agregar
        </Button>
      </div>
    </div>
  )
}
