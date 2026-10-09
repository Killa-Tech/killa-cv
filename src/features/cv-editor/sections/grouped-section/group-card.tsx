import { Badge } from '@/core/ui/badge'
import { Button } from '@/core/ui/button'
import { Input } from '@/core/ui/input'
import type { GrupoItem } from '@/domain/cv'
import { Plus, Trash2, X } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'

interface GroupCardProps {
  group: GrupoItem
  onUpdate: (patch: Partial<Omit<GrupoItem, 'id'>>) => void
  onRemove: () => void
}

export function GroupCard({ group, onUpdate, onRemove }: GroupCardProps) {
  const [tagInput, setTagInput] = useState<string>('')

  const handleAddTag = () => {
    const trimmed = tagInput.trim()
    if (!trimmed) return

    // Soporte para separar por comas si se pega texto "React, Next.js, TypeScript"
    const newTags = trimmed
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '' && !group.elementos.includes(t))

    if (newTags.length > 0) {
      onUpdate({ elementos: [...group.elementos, ...newTags] })
    }
    setTagInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdate({ elementos: group.elementos.filter((t) => t !== tagToRemove) })
  }

  return (
    <div className="p-3 rounded-lg bg-surface-container-low/50 border border-border/50 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <Input
          value={group.categoria}
          onChange={(e) => onUpdate({ categoria: e.target.value })}
          placeholder="Nombre de la Categoría (ej: Lenguajes de Programación)"
          className="h-7 text-xs font-heading font-semibold text-foreground max-w-sm"
        />

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onRemove}
          className="size-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
          title="Eliminar grupo"
        >
          <Trash2 className="size-3" />
        </Button>
      </div>

      {/* Lista interactiva de Badges/Chips */}
      <div className="flex flex-wrap items-center gap-1.5 min-h-6">
        {group.elementos.map((element, idx) => (
          <Badge
            key={idx}
            variant="cyber"
            className="text-[11px] gap-1 pl-2 pr-1 py-0.5"
          >
            <span>{element}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(element)}
              className="text-primary hover:text-destructive hover:bg-destructive/10 rounded-full p-0.5 transition-colors"
            >
              <X className="size-2.5" />
            </button>
          </Badge>
        ))}

        {group.elementos.length === 0 && (
          <span className="text-[11px] text-muted-foreground italic">
            Sin etiquetas aún. Escribe abajo y pulsa Enter.
          </span>
        )}
      </div>

      {/* Input para agregar nuevos chips */}
      <div className="flex items-center gap-1.5 pt-1">
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe una etiqueta y presiona Enter o coma..."
          className="h-7 text-xs flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={handleAddTag}
          disabled={!tagInput.trim()}
          className="h-7 text-xs text-primary gap-1"
        >
          <Plus className="size-3" />
          Añadir
        </Button>
      </div>
    </div>
  )
}
