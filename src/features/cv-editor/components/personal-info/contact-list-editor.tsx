import { Button } from '@/core/ui/button'
import { Input } from '@/core/ui/input'
import { CONTACTO_PRESETS, type ContactoItem } from '@/domain/cv'
import { Plus, Trash2, Globe, Mail, Phone, MapPin, Link2 } from 'lucide-react'

function GithubIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function LinkedinIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function getContactIcon(tipo: string) {
  const normalized = tipo.toLowerCase()
  if (normalized.includes('email') || normalized.includes('correo')) return <Mail className="size-3.5 text-primary" />
  if (normalized.includes('tel') || normalized.includes('phone')) return <Phone className="size-3.5 text-primary" />
  if (normalized.includes('ubi') || normalized.includes('loc') || normalized.includes('dir')) return <MapPin className="size-3.5 text-primary" />
  if (normalized.includes('link')) return <LinkedinIcon className="size-3.5 text-primary" />
  if (normalized.includes('git')) return <GithubIcon className="size-3.5 text-primary" />
  if (normalized.includes('web') || normalized.includes('port')) return <Globe className="size-3.5 text-primary" />
  return <Link2 className="size-3.5 text-primary" />
}

interface ContactListEditorProps {
  contacts: ContactoItem[]
  onAdd: (tipo?: string, valor?: string, url?: string) => void
  onUpdate: (id: string, patch: Partial<Omit<ContactoItem, 'id'>>) => void
  onRemove: (id: string) => void
}

export function ContactListEditor({
  contacts,
  onAdd,
  onUpdate,
  onRemove,
}: ContactListEditorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-heading font-medium uppercase tracking-wider text-muted-foreground">
          Datos de Contacto y Enlaces ({contacts.length})
        </label>

        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={() => onAdd('email', '', '')}
          className="gap-1 text-xs text-primary hover:bg-primary/10"
        >
          <Plus className="size-3" />
          Añadir Contacto
        </Button>
      </div>

      {contacts.length === 0 ? (
        <div className="p-3 text-center rounded-lg border border-dashed border-border/60 text-muted-foreground text-xs">
          No hay datos de contacto. Añade al menos tu email o teléfono.
        </div>
      ) : (
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low/50 border border-border/40 transition-colors hover:border-border/80"
            >
              <div className="shrink-0 flex items-center justify-center size-7 rounded bg-surface-container-high/80 border border-border/40">
                {getContactIcon(contact.tipo)}
              </div>

              {/* Selector de tipo o texto libre */}
              <div className="w-28 sm:w-32 shrink-0">
                <select
                  value={contact.tipo}
                  onChange={(e) => onUpdate(contact.id, { tipo: e.target.value })}
                  className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs font-medium text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                >
                  {CONTACTO_PRESETS.map((preset) => (
                    <option key={preset.tipo} value={preset.tipo}>
                      {preset.label}
                    </option>
                  ))}
                  {!CONTACTO_PRESETS.some((p) => p.tipo === contact.tipo) && (
                    <option value={contact.tipo}>{contact.tipo}</option>
                  )}
                </select>
              </div>

              {/* Valor del contacto */}
              <div className="flex-1 min-w-0">
                <Input
                  value={contact.valor}
                  onChange={(e) => onUpdate(contact.id, { valor: e.target.value })}
                  placeholder="ej: john.doe@example.com"
                  className="h-8 text-xs font-mono"
                />
              </div>

              {/* Botón eliminar */}
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => onRemove(contact.id)}
                className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                title="Eliminar contacto"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
