import { Trash2 } from 'lucide-react'
import { BulletListEditor } from './bullet-list-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { EntradaItem } from '@/types/cv'

interface EntryCardProps {
  item: EntradaItem
  index: number
  onChange: (updated: EntradaItem) => void
  onRemove: () => void
}

export function EntryCard({ item, index, onChange, onRemove }: EntryCardProps) {
  return (
    <div className="relative p-3 rounded-lg border border-border/50 bg-surface-container-lowest/50 space-y-3">
      {/* Cabecera de la entrada */}
      <div className="flex items-center justify-between border-b border-border/30 pb-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Entrada #{index + 1}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onRemove}
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
            onChange={(e) => onChange({ ...item, primario_izq: e.target.value })}
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
            onChange={(e) => onChange({ ...item, primario_der: e.target.value })}
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
            onChange={(e) => onChange({ ...item, secundario_izq: e.target.value })}
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
            onChange={(e) => onChange({ ...item, secundario_der: e.target.value })}
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
          onChange={(e) => onChange({ ...item, descripcion: e.target.value })}
          placeholder="Breve resumen de responsabilidades generales o contexto..."
          className="min-h-[50px] text-xs bg-background/50"
        />
      </div>

      {/* Viñetas / Logros con Viñetas */}
      <BulletListEditor
        vinetas={item.vinetas}
        onChange={(vinetas) => onChange({ ...item, vinetas })}
      />
    </div>
  )
}
