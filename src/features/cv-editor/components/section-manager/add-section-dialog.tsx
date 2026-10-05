import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/core/ui/dialog'
import { Button } from '@/core/ui/button'
import { Input } from '@/core/ui/input'
import { SECTION_PRESETS, type TipoSeccion } from '@/domain/cv'
import { SECTION_TYPE_METADATA } from '../../registry/section-registry'
import { Plus, Sparkles, FileText, Briefcase, Tags, List } from 'lucide-react'

interface AddSectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (tipo: TipoSeccion, titulo: string) => void
}

function getSectionTypeIcon(tipo: TipoSeccion) {
  switch (tipo) {
    case 'texto':
      return <FileText className="size-4 text-blue-400" />
    case 'entradas':
      return <Briefcase className="size-4 text-emerald-400" />
    case 'agrupado':
      return <Tags className="size-4 text-cyan-400" />
    case 'lista':
      return <List className="size-4 text-purple-400" />
  }
}

export function AddSectionDialog({ open, onOpenChange, onAdd }: AddSectionDialogProps) {
  const [customTitle, setCustomTitle] = React.useState<string>('')
  const [selectedType, setSelectedType] = React.useState<TipoSeccion>('entradas')

  const handleSelectPreset = (tipo: TipoSeccion, titulo: string) => {
    onAdd(tipo, titulo)
    onOpenChange(false)
  }

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = customTitle.trim()
    if (!trimmed) return
    onAdd(selectedType, trimmed.toUpperCase())
    setCustomTitle('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-heading font-bold text-foreground">
                Añadir Sección al Currículum
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Selecciona una sección predefinida o crea una personalizada con el tipo de datos adecuado.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Secciones Recomendadas (Presets) */}
          <div className="space-y-2">
            <span className="text-[11px] font-heading font-medium uppercase tracking-wider text-muted-foreground">
              Plantillas de Secciones Recomendadas
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SECTION_PRESETS.map((preset) => {
                const meta = SECTION_TYPE_METADATA[preset.tipo]
                return (
                  <button
                    key={preset.titulo}
                    type="button"
                    onClick={() => handleSelectPreset(preset.tipo, preset.titulo)}
                    className="flex flex-col text-left p-2.5 rounded-lg border border-border/60 bg-surface-container-low/40 hover:bg-surface-container hover:border-primary/50 transition-all group"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5 font-heading text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                        {getSectionTypeIcon(preset.tipo)}
                        <span>{preset.titulo}</span>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${meta.badgeColor}`}>
                        {meta.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      {preset.descripcion}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sección Personalizada */}
          <form onSubmit={handleAddCustom} className="p-3 rounded-lg border border-border/60 bg-surface-container-low/60 space-y-3">
            <span className="text-[11px] font-heading font-medium uppercase tracking-wider text-muted-foreground block">
              O Crear Sección Personalizada
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2">
                <Input
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Título (ej: VOLUNTARIADO)"
                  className="h-8 text-xs font-heading"
                />
              </div>

              <div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as TipoSeccion)}
                  className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs font-medium text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                >
                  <option value="entradas">Cronología (Harvard)</option>
                  <option value="agrupado">Habilidades & Chips</option>
                  <option value="lista">Lista de Viñetas</option>
                  <option value="texto">Texto Narrativo</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!customTitle.trim()}
              className="w-full text-xs font-heading font-semibold gap-1.5"
            >
              <Plus className="size-3.5" />
              Crear Sección Personalizada
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
