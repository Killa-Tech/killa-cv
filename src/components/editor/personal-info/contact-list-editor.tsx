import { Plus } from 'lucide-react'
import { ContactItemRow } from './contact-item-row'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CONTACTO_PRESETS, createContacto } from '@/lib/cv-defaults'
import type { ContactoItem } from '@/types/cv'

interface ContactListEditorProps {
  contactos: ContactoItem[]
  onChange: (contactos: ContactoItem[]) => void
}

export function ContactListEditor({ contactos, onChange }: ContactListEditorProps) {
  const handleAddContacto = (tipo = 'email') => {
    const preset = CONTACTO_PRESETS.find((p) => p.tipo === tipo)
    const newContacto = createContacto(tipo, '', preset ? '' : undefined)
    onChange([...contactos, newContacto])
  }

  const handleUpdateContacto = (index: number, updatedItem: ContactoItem) => {
    const next = [...contactos]
    next[index] = updatedItem
    onChange(next)
  }

  const handleRemoveContacto = (index: number) => {
    onChange(contactos.filter((_, i) => i !== index))
  }

  return (
    <div className="pt-2 border-t border-border/40">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-xs font-semibold text-foreground uppercase tracking-wider">
          Medios de Contacto & Redes ({contactos.length})
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="text-xs gap-1 text-primary"
          onClick={() => handleAddContacto('email')}
        >
          <Plus className="size-3" />
          Añadir Contacto
        </Button>
      </div>

      <div className="space-y-2">
        {contactos.map((c, idx) => (
          <ContactItemRow
            key={c.id || idx}
            item={c}
            onChange={(updated) => handleUpdateContacto(idx, updated)}
            onRemove={() => handleRemoveContacto(idx)}
          />
        ))}

        {contactos.length === 0 && (
          <p className="text-xs text-muted-foreground italic py-1 text-center">
            Sin contactos agregados. Añade al menos un correo o ubicación.
          </p>
        )}
      </div>
    </div>
  )
}
