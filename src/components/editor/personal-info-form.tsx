import { User } from 'lucide-react'
import { ContactListEditor } from './personal-info/contact-list-editor'
import { PhotoUpload } from './personal-info/photo-upload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { DatosPersonales } from '@/types/cv'

interface PersonalInfoFormProps {
  data: DatosPersonales
  onChange: (data: DatosPersonales) => void
}

export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const handleTextChange = (field: keyof DatosPersonales, value: string) => {
    onChange({
      ...data,
      [field]: value,
    })
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
            <PhotoUpload
              foto={data.foto}
              onChange={(base64Foto) => onChange({ ...data, foto: base64Foto })}
            />
          </div>
        </div>

        {/* Sección de Contacto */}
        <ContactListEditor
          contactos={data.contacto}
          onChange={(newContacto) => onChange({ ...data, contacto: newContacto })}
        />
      </CardContent>
    </Card>
  )
}
