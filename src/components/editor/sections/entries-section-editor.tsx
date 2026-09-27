import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createEntradaItem } from '@/lib/cv-defaults'
import type { EntradaItem, SeccionEntradas } from '@/types/cv'

interface EntriesSectionEditorProps {
  section: SeccionEntradas
  onChange: (updated: SeccionEntradas) => void
}

export function EntriesSectionEditor({ section, onChange }: EntriesSectionEditorProps) {
  const handleItemChange = (index: number, updatedItem: EntradaItem) => {
    const newItems = [...section.items]
    newItems[index] = updatedItem
    onChange({
      ...section,
      items: newItems,
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

  const handleAddVineta = (itemIndex: number) => {
    const item = section.items[itemIndex]
    const vinetas = [...(item.vinetas || []), '']
    handleItemChange(itemIndex, { ...item, vinetas })
  }

  const handleVinetaChange = (itemIndex: number, vinetaIndex: number, val: string) => {
    const item = section.items[itemIndex]
    const vinetas = [...(item.vinetas || [])]
    vinetas[vinetaIndex] = val
    handleItemChange(itemIndex, { ...item, vinetas })
  }

  const handleRemoveVineta = (itemIndex: number, vinetaIndex: number) => {
    const item = section.items[itemIndex]
    const vinetas = (item.vinetas || []).filter((_, i) => i !== vinetaIndex)
    handleItemChange(itemIndex, { ...item, vinetas })
  }

  return (
    <div className="space-y-4 pt-1">
      {section.items.map((item, itemIdx) => (
        <div
          key={item.id || itemIdx}
          className="relative p-3 rounded-lg border border-border/50 bg-surface-container-lowest/50 space-y-3"
        >
          {/* Cabecera de la entrada */}
          <div className="flex items-center justify-between border-b border-border/30 pb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Entrada #{itemIdx + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => handleRemoveItem(itemIdx)}
              className="hover:text-destructive text-muted-foreground"
              title="Eliminar esta entrada"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>

          {/* Fila 1: Primario Izquierda (Empresa) y Primario Derecha (Fecha) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <div className="md:col-span-8 space-y-1">
              <Label className="text-[11px] text-muted-foreground">
                Institución / Empresa / Título Principal
              </Label>
              <Input
                value={item.primario_izq || ''}
                onChange={(e) =>
                  handleItemChange(itemIdx, { ...item, primario_izq: e.target.value })
                }
                placeholder="Ej. Google / Universidad Nacional"
                className="h-7 text-xs bg-background/50 font-medium"
              />
            </div>
            <div className="md:col-span-4 space-y-1">
              <Label className="text-[11px] text-muted-foreground">
                Período / Fecha
              </Label>
              <Input
                value={item.primario_der || ''}
                onChange={(e) =>
                  handleItemChange(itemIdx, { ...item, primario_der: e.target.value })
                }
                placeholder="Ej. 2023 – Presente"
                className="h-7 text-xs bg-background/50"
              />
            </div>
          </div>

          {/* Fila 2: Secundario Izquierda (Cargo) y Secundario Derecha (Ubicación) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <div className="md:col-span-8 space-y-1">
              <Label className="text-[11px] text-muted-foreground">
                Cargo / Rol / Título Obtenido
              </Label>
              <Input
                value={item.secundario_izq || ''}
                onChange={(e) =>
                  handleItemChange(itemIdx, { ...item, secundario_izq: e.target.value })
                }
                placeholder="Ej. Senior Software Engineer"
                className="h-7 text-xs bg-background/50 italic"
              />
            </div>
            <div className="md:col-span-4 space-y-1">
              <Label className="text-[11px] text-muted-foreground">
                Ubicación / Modalidad
              </Label>
              <Input
                value={item.secundario_der || ''}
                onChange={(e) =>
                  handleItemChange(itemIdx, { ...item, secundario_der: e.target.value })
                }
                placeholder="Ej. Buenos Aires / Remoto"
                className="h-7 text-xs bg-background/50"
              />
            </div>
          </div>

          {/* Descripción Opcional */}
          <div className="space-y-1">
            <Label className="text-[11px] text-muted-foreground">
              Descripción general del rol o proyecto (Opcional)
            </Label>
            <Textarea
              value={item.descripcion || ''}
              onChange={(e) =>
                handleItemChange(itemIdx, { ...item, descripcion: e.target.value })
              }
              placeholder="Breve resumen de responsabilidades generales o contexto..."
              className="min-h-[50px] text-xs bg-background/50"
            />
          </div>

          {/* Viñetas / Logros con Viñetas */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <Label className="text-[11px] font-semibold text-foreground">
                Logros & Responsabilidades (Viñetas Harvard)
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                className="text-[11px] h-6 px-1.5 gap-1 text-primary"
                onClick={() => handleAddVineta(itemIdx)}
              >
                <Plus className="size-3" />
                Añadir Viñeta
              </Button>
            </div>

            <div className="space-y-1.5">
              {(item.vinetas || []).map((vineta, vinIdx) => (
                <div key={vinIdx} className="flex items-center gap-1.5">
                  <span className="text-primary text-xs select-none">•</span>
                  <Input
                    value={vineta}
                    onChange={(e) => handleVinetaChange(itemIdx, vinIdx, e.target.value)}
                    placeholder="Logro cuantificable (ej. 'Incrementé el rendimiento en un 30% mediante...')"
                    className="h-7 text-xs bg-background/50 flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleRemoveVineta(itemIdx, vinIdx)}
                    className="hover:text-destructive"
                    title="Eliminar viñeta"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
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
