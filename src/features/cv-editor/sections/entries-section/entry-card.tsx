import * as React from 'react'
import { Card, CardContent, CardHeader } from '@/core/ui/card'
import { Input } from '@/core/ui/input'
import { Label } from '@/core/ui/label'
import { Button } from '@/core/ui/button'
import type { EntradaItem } from '@/domain/cv'
import { BulletListEditor } from './bullet-list-editor'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'

interface EntryCardProps {
  item: EntradaItem
  index: number
  onUpdate: (patch: Partial<Omit<EntradaItem, 'id'>>) => void
  onRemove: () => void
}

export function EntryCard({ item, index, onUpdate, onRemove }: EntryCardProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(true)

  const headerTitle =
    item.primario_izq || item.secundario_izq || `Entrada #${index + 1}`

  const headerSubtitle = [item.secundario_izq, item.primario_der]
    .filter(Boolean)
    .join(' • ')

  return (
    <Card className="border-border/60 bg-surface-container-low/40 shadow-xs transition-all">
      <CardHeader
        className="py-2 px-3 flex flex-row items-center justify-between gap-2 cursor-pointer select-none border-b border-border/30 hover:bg-surface-container-low/80 transition-colors"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-heading font-semibold text-foreground truncate">
              {headerTitle}
            </span>
            {item.primario_der && (
              <span className="text-[10px] font-mono text-primary font-medium shrink-0">
                {item.primario_der}
              </span>
            )}
          </div>
          {headerSubtitle && (
            <p className="text-[10px] text-muted-foreground truncate">
              {headerSubtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onRemove}
            className="size-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Eliminar entrada"
          >
            <Trash2 className="size-3" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => setIsOpen((prev) => !prev)}
            className="size-6 text-muted-foreground hover:text-foreground"
          >
            {isOpen ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </Button>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="p-3 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">
                Institución / Empresa
              </Label>
              <Input
                value={item.primario_izq || ''}
                onChange={(e) => onUpdate({ primario_izq: e.target.value })}
                placeholder="ej: Tech Innovations Inc."
                className="h-7 text-xs font-medium"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">
                Período / Fechas
              </Label>
              <Input
                value={item.primario_der || ''}
                onChange={(e) => onUpdate({ primario_der: e.target.value })}
                placeholder="ej: 2022 – Presente"
                className="h-7 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">
                Rol / Título Obtenido
              </Label>
              <Input
                value={item.secundario_izq || ''}
                onChange={(e) => onUpdate({ secundario_izq: e.target.value })}
                placeholder="ej: Lead Software Engineer"
                className="h-7 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">
                Ubicación
              </Label>
              <Input
                value={item.secundario_der || ''}
                onChange={(e) => onUpdate({ secundario_der: e.target.value })}
                placeholder="ej: San Francisco, CA / Remoto"
                className="h-7 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-[11px] text-muted-foreground">
              Descripción general (Opcional)
            </Label>
            <Input
              value={item.descripcion || ''}
              onChange={(e) => onUpdate({ descripcion: e.target.value })}
              placeholder="Breve resumen de responsabilidades generales..."
              className="h-7 text-xs"
            />
          </div>

          <div className="pt-2 border-t border-border/30">
            <BulletListEditor
              bullets={item.vinetas || []}
              onChange={(vinetas) => onUpdate({ vinetas })}
            />
          </div>
        </CardContent>
      )}
    </Card>
  )
}
