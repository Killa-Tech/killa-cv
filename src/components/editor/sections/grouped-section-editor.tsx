import * as React from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createGrupoItem } from '@/lib/cv-defaults'
import type { GrupoItem, SeccionAgrupado } from '@/types/cv'

interface GroupedSectionEditorProps {
  section: SeccionAgrupado
  onChange: (updated: SeccionAgrupado) => void
}

export function GroupedSectionEditor({ section, onChange }: GroupedSectionEditorProps) {
  const [newElemInputs, setNewElemInputs] = React.useState<Record<number, string>>({})

  const handleGroupChange = (index: number, updatedGroup: GrupoItem) => {
    const newGrupos = [...section.grupos]
    newGrupos[index] = updatedGroup
    onChange({
      ...section,
      grupos: newGrupos,
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

  const handleAddElement = (groupIdx: number) => {
    const val = (newElemInputs[groupIdx] || '').trim()
    if (!val) return

    const grupo = section.grupos[groupIdx]
    const elementos = [...grupo.elementos, val]
    handleGroupChange(groupIdx, { ...grupo, elementos })

    setNewElemInputs((prev) => ({ ...prev, [groupIdx]: '' }))
  }

  const handleRemoveElement = (groupIdx: number, elemIdx: number) => {
    const grupo = section.grupos[groupIdx]
    const elementos = grupo.elementos.filter((_, i) => i !== elemIdx)
    handleGroupChange(groupIdx, { ...grupo, elementos })
  }

  return (
    <div className="space-y-4 pt-1">
      {section.grupos.map((grupo, gIdx) => (
        <div
          key={grupo.id || gIdx}
          className="p-3 rounded-lg border border-border/50 bg-surface-container-lowest/50 space-y-2.5"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 space-y-1">
              <Label className="text-[11px] text-muted-foreground">
                Categoría (ej. Frontend, Herramientas, Idiomas)
              </Label>
              <Input
                value={grupo.categoria}
                onChange={(e) => handleGroupChange(gIdx, { ...grupo, categoria: e.target.value })}
                placeholder="Nombre de la categoría..."
                className="h-7 text-xs bg-background/50 font-semibold"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => handleRemoveGroup(gIdx)}
              className="hover:text-destructive text-muted-foreground mt-4"
              title="Eliminar grupo"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>

          {/* Tags existentes */}
          <div className="flex flex-wrap gap-1.5 items-center min-h-[28px] p-1.5 rounded-md bg-background/40 border border-border/30">
            {grupo.elementos.map((elem, eIdx) => (
              <Badge
                key={eIdx}
                variant="outline"
                className="gap-1 text-xs py-0.5 px-2 bg-primary/10 border-primary/30 text-foreground"
              >
                <span>{elem}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveElement(gIdx, eIdx)}
                  className="rounded-full hover:text-destructive focus:outline-none"
                >
                  <X className="size-2.5" />
                </button>
              </Badge>
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
              value={newElemInputs[gIdx] || ''}
              onChange={(e) =>
                setNewElemInputs((prev) => ({ ...prev, [gIdx]: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddElement(gIdx)
                }
              }}
              placeholder="Escribe una tecnología o tag y presiona Enter..."
              className="h-7 text-xs bg-background/50 flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              size="xs"
              onClick={() => handleAddElement(gIdx)}
              className="h-7 text-xs gap-1"
            >
              <Plus className="size-3" />
              Agregar
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddGroup}
        className="w-full gap-1.5 text-xs border-dashed border-border/80 hover:border-primary text-muted-foreground hover:text-primary"
      >
        <Plus className="size-3.5" />
        Añadir Otro Grupo o Categoría
      </Button>
    </div>
  )
}
