import { Card, CardContent, CardHeader, CardTitle } from '@/core/ui/card'
import { Input } from '@/core/ui/input'
import { Label } from '@/core/ui/label'
import { Button } from '@/core/ui/button'
import { useCVStore } from '@/store'
import { AvatarUpload } from './avatar-upload'
import { ContactListEditor } from './contact-list-editor'
import { ChevronDown, ChevronUp, User } from 'lucide-react'
import { useState } from 'react'

export function PersonalInfoForm() {
  const [isOpen, setIsOpen] = useState(true)

  const datosPersonales = useCVStore((state) => state.cvData.datos_personales)
  const updatePersonalInfo = useCVStore((state) => state.updatePersonalInfo)
  const addContactItem = useCVStore((state) => state.addContactItem)
  const updateContactItem = useCVStore((state) => state.updateContactItem)
  const removeContactItem = useCVStore((state) => state.removeContactItem)

  return (
    <Card className="border-border/70 bg-card/90 shadow-sm transition-all">
      <CardHeader
        className="cursor-pointer py-3.5 px-4 flex flex-row items-center justify-between gap-2 select-none border-b border-border/40 hover:bg-surface-container-low/40 transition-colors"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center size-7 rounded-md bg-primary/10 text-primary border border-primary/20">
            <User className="size-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-heading font-semibold text-foreground">
              Datos Personales
            </CardTitle>
            <p className="text-[11px] text-muted-foreground font-mono">
              {datosPersonales.nombre_completo || 'Sin nombre asignado'}
              {datosPersonales.titulo ? ` • ${datosPersonales.titulo}` : ''}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground hover:text-foreground"
        >
          {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </Button>
      </CardHeader>

      {isOpen && (
        <CardContent className="p-4 space-y-4">
          <AvatarUpload
            foto={datosPersonales.foto}
            nombre={datosPersonales.nombre_completo}
            onChange={(foto) => updatePersonalInfo({ foto })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="nombre_completo" className="text-xs text-foreground font-medium">
                Nombre Completo <span className="text-primary">*</span>
              </Label>
              <Input
                id="nombre_completo"
                value={datosPersonales.nombre_completo}
                onChange={(e) => updatePersonalInfo({ nombre_completo: e.target.value })}
                placeholder="ej: John Doe"
                className="h-8 text-xs font-heading font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="titulo_profesional" className="text-xs text-foreground font-medium">
                Título o Cargo Profesional
              </Label>
              <Input
                id="titulo_profesional"
                value={datosPersonales.titulo || ''}
                onChange={(e) => updatePersonalInfo({ titulo: e.target.value })}
                placeholder="ej: Senior Software Engineer"
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-border/40">
            <ContactListEditor
              contacts={datosPersonales.contacto}
              onAdd={addContactItem}
              onUpdate={updateContactItem}
              onRemove={removeContactItem}
            />
          </div>
        </CardContent>
      )}
    </Card>
  )
}
