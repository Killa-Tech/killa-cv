import * as React from 'react'
import { Button } from '@/core/ui/button'
import { Input } from '@/core/ui/input'
import type { SectionEditorProps, SeccionLista } from '@/domain/cv'
import { Plus, Trash2 } from 'lucide-react'

export function ListSectionEditor({
  section,
  onUpdate,
}: SectionEditorProps<SeccionLista>) {
  const elementos = section.elementos || []

  const handleElementChange = (index: number, val: string) => {
    const next = [...elementos]
    next[index] = val
    onUpdate({ elementos: next })
  }

  const handleAddElement = (insertIndex?: number) => {
    const next = [...elementos]
    if (typeof insertIndex === 'number') {
      next.splice(insertIndex + 1, 0, '')
    } else {
      next.push('')
    }
    onUpdate({ elementos: next })
  }

  const handleRemoveElement = (index: number) => {
    const next = elementos.filter((_, i) => i !== index)
    onUpdate({ elementos: next })
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddElement(index)
    } else if (e.key === 'Backspace' && elementos[index] === '' && elementos.length > 1) {
      e.preventDefault()
      handleRemoveElement(index)
    }
  }

  return (
    <div className="space-y-3">
      {elementos.length === 0 ? (
        <div className="p-4 text-center rounded-lg border border-dashed border-border/60 text-muted-foreground text-xs space-y-2">
          <p>No hay elementos en esta lista.</p>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => handleAddElement()}
            className="gap-1.5 text-xs text-primary"
          >
            <Plus className="size-3.5" />
            Añadir Primer Elemento
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {elementos.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-1.5 rounded-md bg-surface-container-low/40 border border-border/40"
            >
              <span className="text-primary font-bold text-xs select-none pl-1">•</span>
              <Input
                value={item}
                onChange={(e) => handleElementChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                placeholder="ej: Certificación AWS Certified Solutions Architect - Associate"
                className="h-7 text-xs flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => handleRemoveElement(index)}
                className="size-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                title="Eliminar elemento"
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => handleAddElement()}
            className="w-full py-2 text-xs font-heading font-medium text-primary hover:bg-primary/10 gap-1.5 border-dashed"
          >
            <Plus className="size-3.5" />
            Añadir Elemento a la Lista
          </Button>
        </div>
      )}
    </div>
  )
}
