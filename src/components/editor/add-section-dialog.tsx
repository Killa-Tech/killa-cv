import * as React from 'react'
import { FileText, FolderTree, List, Plus, Sparkles, TableProperties } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SECTION_PRESETS, createSection } from '@/lib/cv-defaults'
import type { SeccionCV } from '@/types/cv'

interface AddSectionDialogProps {
  onAddSection: (section: SeccionCV) => void
}

export function AddSectionDialog({ onAddSection }: AddSectionDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [customTitle, setCustomTitle] = React.useState('')
  const [customTipo, setCustomTipo] = React.useState<SeccionCV['tipo']>('entradas')

  const handleSelectPreset = (preset: (typeof SECTION_PRESETS)[0]) => {
    const newSection = createSection(preset.tipo, preset.titulo)
    onAddSection(newSection)
    setOpen(false)
  }

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault()
    const title = customTitle.trim()
    if (!title) return

    const newSection = createSection(customTipo, title)
    onAddSection(newSection)
    setCustomTitle('')
    setOpen(false)
  }

  const getTipoIcon = (tipo: SeccionCV['tipo']) => {
    switch (tipo) {
      case 'entradas':
        return <TableProperties className="size-4 text-primary" />
      case 'agrupado':
        return <FolderTree className="size-4 text-primary" />
      case 'lista':
        return <List className="size-4 text-primary" />
      case 'texto':
        return <FileText className="size-4 text-primary" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="default"
            size="sm"
            className="w-full gap-2 shadow-cyan-glow"
          />
        }
      >
        <Plus className="size-4" />
        Añadir Nueva Sección al CV
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto border-border/80 bg-card/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg font-bold flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            Añadir Sección al CV
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Escoge una plantilla recomendada o diseña una sección libre respetando el esquema Typst.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Opción 1: Plantillas rápidas */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Plantillas Rápidas
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SECTION_PRESETS.map((preset, idx) => (
                <Button
                  key={idx}
                  type="button"
                  variant="outline"
                  onClick={() => handleSelectPreset(preset)}
                  className="h-auto flex flex-col items-start text-left p-2.5 rounded-lg border border-border/60 bg-surface-container-lowest/50 hover:bg-surface-container-low hover:border-primary/60 transition-all group whitespace-normal"
                >
                  <div className="flex items-center gap-2 font-heading font-semibold text-xs text-foreground group-hover:text-primary transition-colors w-full">
                    {getTipoIcon(preset.tipo)}
                    <span>{preset.titulo}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-tight font-normal">
                    {preset.descripcion}
                  </p>
                </Button>
              ))}
            </div>
          </div>

          {/* Opción 2: Sección totalmente personalizada */}
          <form
            onSubmit={handleCreateCustom}
            className="pt-3 border-t border-border/40 space-y-3"
          >
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider block">
              Sección a Medida (Cualquier Nombre)
            </span>

            <div className="space-y-1.5">
              <Label htmlFor="custom_title" className="text-xs text-muted-foreground font-medium">
                Título de la Sección
              </Label>
              <Input
                id="custom_title"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Ej. PREMIOS Y DISTINCIONES, VOLUNTARIADO..."
                className="bg-surface-container-lowest/50 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium">
                Tipo de Maquetación Typst
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    tipo: 'entradas' as const,
                    label: 'Entradas (Harvard)',
                    desc: 'Doble nivel con viñetas',
                  },
                  {
                    tipo: 'agrupado' as const,
                    label: 'Agrupado (Tags)',
                    desc: 'Categorías en negrita + tags',
                  },
                  {
                    tipo: 'lista' as const,
                    label: 'Lista Simple',
                    desc: 'Viñetas directas',
                  },
                  {
                    tipo: 'texto' as const,
                    label: 'Texto Continuo',
                    desc: 'Párrafo narrativo',
                  },
                ].map((item) => (
                  <Button
                    key={item.tipo}
                    type="button"
                    variant="outline"
                    onClick={() => setCustomTipo(item.tipo)}
                    className={`h-auto flex flex-col items-start text-left p-2 rounded-lg border text-xs transition-all whitespace-normal ${
                      customTipo === item.tipo
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'border-border/50 bg-surface-container-lowest/40 text-muted-foreground hover:border-border/80'
                    }`}
                  >
                    <span className="font-heading">{item.label}</span>
                    <span className="text-[10px] opacity-80 mt-0.5 font-normal">{item.desc}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              variant="secondary"
              size="sm"
              disabled={!customTitle.trim()}
              className="w-full mt-2"
            >
              Crear Sección Personalizada
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddSectionDialog
