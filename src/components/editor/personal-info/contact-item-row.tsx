import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ContactoItem } from '@/types/cv'

interface ContactItemRowProps {
  item: ContactoItem
  onChange: (updated: ContactoItem) => void
  onRemove: () => void
}

export function ContactItemRow({ item, onChange, onRemove }: ContactItemRowProps) {
  return (
    <div className="grid grid-cols-12 gap-1.5 items-center p-2 rounded-lg bg-surface-container-lowest/60 border border-border/40 hover:border-border/70 transition-colors">
      <div className="col-span-3">
        <Input
          value={item.tipo}
          onChange={(e) =>
            onChange({
              ...item,
              tipo: e.target.value.toLowerCase(),
            })
          }
          placeholder="tipo (email...)"
          className="h-7 text-xs bg-background/50"
        />
      </div>

      <div className="col-span-4">
        <Input
          value={item.valor}
          onChange={(e) =>
            onChange({
              ...item,
              valor: e.target.value,
            })
          }
          placeholder="Texto visible"
          className="h-7 text-xs bg-background/50"
        />
      </div>

      <div className="col-span-4">
        <Input
          value={item.url || ''}
          onChange={(e) =>
            onChange({
              ...item,
              url: e.target.value,
            })
          }
          placeholder="URL (opcional)"
          className="h-7 text-xs bg-background/50"
        />
      </div>

      <div className="col-span-1 flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onRemove}
          className="hover:text-destructive"
          title="Eliminar contacto"
        >
          <Trash2 className="size-3" />
        </Button>
      </div>
    </div>
  )
}
