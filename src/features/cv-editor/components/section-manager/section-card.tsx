import { Card, CardContent, CardHeader } from '@/core/ui/card'
import { Input } from '@/core/ui/input'
import { Button } from '@/core/ui/button'
import { SECTION_REGISTRY, SECTION_TYPE_METADATA } from '../../registry/section-registry'
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit2,
  Check,
} from 'lucide-react'
import { useState } from 'react'
import { useCVStore } from '@/store'

interface SectionCardProps {
  sectionId: string
  index: number
  isFirst: boolean
  isLast: boolean
  isCollapsed: boolean
  onToggleCollapse: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export function SectionCard({
  sectionId,
  index,
  isFirst,
  isLast,
  isCollapsed,
  onToggleCollapse,
  onMoveUp,
  onMoveDown,
}: SectionCardProps) {
  const section = useCVStore((s) =>
    s.cvData.secciones.find((sec) => sec.id === sectionId)
  )
  const updateSection = useCVStore((s) => s.updateSection)
  const removeSection = useCVStore((s) => s.removeSection)
  const duplicateSection = useCVStore((s) => s.duplicateSection)

  if (!section) return null


  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false)
  const [titleDraft, setTitleDraft] = useState<string>(section.titulo)

  const meta = SECTION_TYPE_METADATA[section.tipo]
  const EditorComponent = SECTION_REGISTRY[section.tipo]

  const handleSaveTitle = () => {
    const trimmed = titleDraft.trim().toUpperCase()
    if (trimmed) {
      updateSection(sectionId, { titulo: trimmed })
    } else {
      setTitleDraft(section.titulo)
    }
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSaveTitle()
    } else if (e.key === 'Escape') {
      setTitleDraft(section.titulo)
      setIsEditingTitle(false)
    }
  }

  return (
    <Card className="border-border/70 bg-card/95 shadow-sm transition-all overflow-hidden">
      {/* Encabezado de la Sección */}
      <CardHeader
        className="py-2.5 px-3 sm:px-4 flex flex-row items-center justify-between gap-2 border-b border-border/40 select-none bg-surface-container-low/30 hover:bg-surface-container-low/60 transition-colors"
        onClick={() => !isEditingTitle && onToggleCollapse()}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="shrink-0 flex items-center justify-center size-5 rounded bg-surface-container-high text-[10px] font-mono font-bold text-muted-foreground">
            {index + 1}
          </span>

          {isEditingTitle ? (
            <div
              className="flex items-center gap-1.5 flex-1 max-w-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <Input
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                autoFocus
                className="h-6 text-xs font-heading font-bold uppercase tracking-wider"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={handleSaveTitle}
                className="size-6 text-primary hover:bg-primary/10"
              >
                <Check className="size-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-heading font-bold text-xs sm:text-sm text-foreground tracking-wide uppercase truncate">
                {section.titulo}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditingTitle(true)
                  setTitleDraft(section.titulo)
                }}
                className="text-muted-foreground hover:text-primary transition-colors p-0.5 rounded"
                title="Editar título de la sección"
              >
                <Edit2 className="size-3" />
              </button>
            </div>
          )}

          <span
            className={`hidden sm:inline-flex text-[9px] px-1.5 py-0.5 rounded border font-mono ${meta.badgeColor}`}
          >
            {meta.label}
          </span>
        </div>

        {/* Acciones de la Tarjeta */}
        <div
          className="flex items-center gap-0.5 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onMoveUp}
            disabled={isFirst}
            className="size-6 text-muted-foreground hover:text-foreground disabled:opacity-20"
            title="Mover arriba"
          >
            <ArrowUp className="size-3" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onMoveDown}
            disabled={isLast}
            className="size-6 text-muted-foreground hover:text-foreground disabled:opacity-20"
            title="Mover abajo"
          >
            <ArrowDown className="size-3" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => duplicateSection(sectionId)}
            className="size-6 text-muted-foreground hover:text-primary hover:bg-primary/10"
            title="Duplicar sección"
          >
            <Copy className="size-3" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => removeSection(sectionId)}
            className="size-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Eliminar sección"
          >
            <Trash2 className="size-3" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onToggleCollapse}
            className="size-6 text-muted-foreground hover:text-foreground"
          >
            {isCollapsed ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
          </Button>
        </div>
      </CardHeader>

      {/* Cuerpo del Editor Polimórfico */}
      {!isCollapsed && (
        <CardContent className="p-3 sm:p-4">
          {EditorComponent ? (
            <EditorComponent section={section} onUpdate={(patch) => updateSection(sectionId, patch)} />
          ) : (
            <div className="p-3 text-xs text-destructive">
              Tipo de sección no reconocido: {section.tipo}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
