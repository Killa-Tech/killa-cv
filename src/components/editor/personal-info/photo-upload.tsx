import * as React from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PhotoUploadProps {
  foto?: string
  onChange: (base64Foto?: string) => void
}

export function PhotoUpload({ foto, onChange }: PhotoUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      onChange(base64)
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    onChange(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
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
        {foto ? 'Cambiar Foto' : 'Subir Imagen'}
      </Button>

      {foto && (
        <div className="flex items-center gap-1.5">
          <img
            src={foto}
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
  )
}
