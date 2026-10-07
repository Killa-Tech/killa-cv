import { Avatar, AvatarFallback, AvatarImage } from '@/core/ui/avatar'
import { Button } from '@/core/ui/button'
import { Camera, Trash2, User } from 'lucide-react'
import { useRef } from 'react'

interface AvatarUploadProps {
  foto?: string
  nombre?: string
  onChange: (dataUri?: string) => void
}

export function AvatarUpload({ foto, nombre, onChange }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (PNG, JPG, WebP).')
      return
    }

    if (file.size > 3 * 1024 * 1024) {
      alert('La imagen no debe superar los 3 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      onChange(result)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleRemove = () => {
    onChange(undefined)
  }

  const initials = nombre
    ? nombre
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : ''

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-surface-container-low/60 border border-border/50">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <Avatar className="size-14 ring-2 ring-primary/40 shadow-sm">
        {foto ? (
          <AvatarImage src={foto} alt={nombre || 'Avatar'} />
        ) : (
          <AvatarFallback className="bg-surface-container-high text-primary font-heading font-semibold text-sm">
            {initials || <User className="size-6 text-muted-foreground" />}
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-heading font-medium text-foreground">
            Fotografía de Perfil
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            (Opcional para plantilla Modern)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs gap-1.5"
          >
            <Camera className="size-3 text-primary" />
            {foto ? 'Cambiar foto' : 'Subir foto'}
          </Button>

          {foto && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={handleRemove}
              className="text-xs text-destructive hover:bg-destructive/10 gap-1"
            >
              <Trash2 className="size-3" />
              Eliminar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
