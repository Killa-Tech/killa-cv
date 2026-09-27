import * as React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { SeccionLista } from '@/types/cv'

interface ListSectionEditorProps {
  section: SeccionLista
  onChange: (updated: SeccionLista) => void
}

export function ListSectionEditor({ section, onChange }: ListSectionEditorProps) {
  const [newElemInput, setNewElemInput] = React.useState('')

  const handleElementChange = (index: number, val: string) => {
    const elementos = [...section.elementos]
    elementos[index] = val
    onChange({
      ...section,
      elementos,
    })
  }

  const handleAddElement = () => {
    const val = newElemInput.trim()
    if (!val) return

    onChange({
      ...section,
      elementos: [...section.elementos, val],
    })
    setNewElemInput('')
  }

  const handleRemoveElement = (index: number) => {
    onChange({
      ...section,
      elementos: section.elementos.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-2.5 pt-1">
      <div className="space-y-1.5">
        {section.elementos.map((elem, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <span className="text-primary text-xs select-none">•</span>
            <Input
              value={elem}
              onChange={(e) => handleElementChange(idx, e.target.value)}
              placeholder="Elemento de la lista..."
              className="h-7 text-xs bg-surface-container-lowest/50 flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => handleRemoveElement(idx)}
              className="hover:text-destructive"
              title="Eliminar elemento"
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* Input para agregar elemento */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-border/30">
        <Input
          value={newElemInput}
          onChange={(e) => setNewElemInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAddElement()
            }
          }}
          placeholder="Escribe un nuevo ítem y presiona Enter..."
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
