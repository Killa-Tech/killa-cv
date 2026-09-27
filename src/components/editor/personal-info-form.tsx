import * as React from 'react'
import { Plus, Trash2, Upload, User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CONTACTO_PRESETS, createContacto } from '@/lib/cv-defaults'
import type { ContactoItem, DatosPersonales } from '@/types/cv'

interface PersonalInfoFormProps {
  data: DatosPersonales
  onChange: (data: DatosPersonales) => void
}

export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleTextChange = (field: keyof DatosPersonales, value: string) => {
    onChange({
      ...data,
      [field]: value,
    })
  }

  const handleContactoChange = (index: number, updatedItem: ContactoItem) => {
    const newContacto = [...data.contacto]
    newContacto[index] = updatedItem
    onChange({
      ...data,
      contacto: newContacto,
    })
  }

  const handleAddContacto = (tipo = 'email') => {
    const preset = CONTACTO_PRESETS.find((p) => p.tipo === tipo)
    const newContacto = createContacto(tipo, '', preset ? '' : undefined)
    onChange({
      ...data,
      contacto: [...data.contacto, newContacto],
    })
  }

  const handleRemoveContacto = (index: number) => {
    const newContacto = data.contacto.filter((_, i) => i !== index)
    onChange({
      ...data,
      contacto: newContacto,
    })
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      onChange({
        ...data,
        foto: base64,
      })
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    onChange({
      ...data,
      foto: undefined,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card className="border-border/70 bg-card/70 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-primary font-heading font-semibold text-base">
          <User className="size-4" />
          <CardTitle className="text-base tracking-wide uppercase">Datos Personales</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Fila 1: Nombre y Título */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="nombre_completo" className="text-xs text-muted-foreground font-medium">
              Nombre Completo <span className="text-primary">*</span>
            </Label>
            <Input
              id="nombre_completo"
              value={data.nombre_completo}
              onChange={(e) => handleTextChange('nombre_completo', e.target.value)}
              placeholder="Ej. Ada Lovelace"
              className="bg-surface-container-lowest/50 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="titulo" className="text-xs text-muted-foreground font-medium">
              Título Profesional / Especialidad
            </Label>
            <Input
              id="titulo"
              value={data.titulo || ''}
              onChange={(e) => handleTextChange('titulo', e.target.value)}
              placeholder="Ej. Ingeniera en Informática & Matemática"
              className="bg-surface-container-lowest/50"
            />
          </div>
        </div>

        {/* Fila 2: Fecha y Foto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="fecha_nacimiento" className="text-xs text-muted-foreground font-medium">
              Fecha de Nacimiento (Opcional)
            </Label>
            <Input
              id="fecha_nacimiento"
              value={data.fecha_nacimiento || ''}
              onChange={(e) => handleTextChange('fecha_nacimiento', e.target.value)}
              placeholder="Ej. 1995-10-14"
              className="bg-surface-container-lowest/50"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-medium">
              Foto de Perfil (Opcional, Plantilla Modern)
            </Label>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="foto-upload"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs flex-1"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="size-3.5" />
                {data.foto ? 'Cambiar Foto' : 'Subir Imagen'}
              </Button>
              {data.foto && (
                <div className="flex items-center gap-1.5">
                  <img
                    src={data.foto}
                    alt="Avatar"
                    className="size-7 rounded-full object-cover border border-primary/40"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={handleRemovePhoto}
                    title="Eliminar foto"
                  >
                    <X className="size-3 text-destructive" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sección de Contacto */}
        <div className="pt-2 border-t border-border/40">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Medios de Contacto & Redes ({data.contacto.length})
            </Label>
            <div className="flex items-center gap-1">
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
          </div>

          <div className="space-y-2">
            {data.contacto.map((c, idx) => (
              <div
                key={c.id || idx}
                className="grid grid-cols-12 gap-1.5 items-center p-2 rounded-lg bg-surface-container-lowest/60 border border-border/40 hover:border-border/70 transition-colors"
              >
                <div className="col-span-3">
                  <Input
                    value={c.tipo}
                    onChange={(e) =>
                      handleContactoChange(idx, {
                        ...c,
                        tipo: e.target.value.toLowerCase(),
                      })
                    }
                    placeholder="tipo (email...)"
                    className="h-7 text-xs bg-background/50"
                  />
                </div>

                <div className="col-span-4">
                  <Input
                    value={c.valor}
                    onChange={(e) =>
                      handleContactoChange(idx, {
                        ...c,
                        valor: e.target.value,
                      })
                    }
                    placeholder="Texto visible"
                    className="h-7 text-xs bg-background/50"
                  />
                </div>

                <div className="col-span-4">
                  <Input
                    value={c.url || ''}
                    onChange={(e) =>
                      handleContactoChange(idx, {
                        ...c,
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
                    onClick={() => handleRemoveContacto(idx)}
                    className="hover:text-destructive"
                    title="Eliminar contacto"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            ))}

            {data.contacto.length === 0 && (
              <p className="text-xs text-muted-foreground italic py-1 text-center">
                Sin contactos agregados. Añade al menos un correo o ubicación.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
