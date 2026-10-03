import {
  ChevronDown, ChevronUp,
  FileText, FolderTree, List, TableProperties, Trash2, GripVertical
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { SeccionCV } from '@/types/cv'

interface SectionCardHeaderProps {
  tipo: SeccionCV['tipo']
  titulo: string
  isCollapsed: boolean
  dragHandleProps?: Record<string, any>
  onTitleChange: (newTitle: string) => void
  onToggleCollapse: () => void
  onDelete: () => void
}

const SECTION_ICONS: Record<SeccionCV['tipo'], React.ReactNode> = {
  entradas: <TableProperties className="size-3.5 text-primary" />,
  agrupado: <FolderTree className="size-3.5 text-primary" />,
  lista: <List className="size-3.5 text-primary" />,
  texto: <FileText className="size-3.5 text-primary" />,
}

export function SectionCardHeader({
  tipo,
  titulo,
  isCollapsed,
  dragHandleProps,
  onTitleChange,
  onToggleCollapse,
  onDelete,
}: SectionCardHeaderProps) {
  return (
    <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between gap-2 border-b border-border/30">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="flex items-center gap-0.5" {...dragHandleProps}>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="size-6 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
            title="Arrastrar para reordenar"
          >
            <GripVertical className="size-4" />
          </Button>
        </div>

        {SECTION_ICONS[tipo]}

        <Input
          value={titulo}
          onChange={(e) => onTitleChange(e.target.value.toUpperCase())}
          className="h-7 text-xs font-heading font-bold uppercase tracking-wider bg-transparent border-transparent hover:border-border/60 focus:border-primary max-w-xs"
        />

        <Badge variant="outline" className="text-[10px] py-0 px-1.5 opacity-80 uppercase">
          {tipo}
        </Badge>
      </div>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Desplegar' : 'Plegar'}
          className="size-6 text-muted-foreground"
        >
          {isCollapsed ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onDelete}
          title="Eliminar sección"
          className="size-6 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </CardHeader>
  )
}
