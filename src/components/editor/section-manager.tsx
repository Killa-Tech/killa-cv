import * as React from 'react'
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  FileText,
  FolderTree,
  List,
  TableProperties,
  Trash2,
} from 'lucide-react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { AddSectionDialog } from '@/components/editor/add-section-dialog'
import { EntriesSectionEditor } from '@/components/editor/sections/entries-section-editor'
import { GroupedSectionEditor } from '@/components/editor/sections/grouped-section-editor'
import { ListSectionEditor } from '@/components/editor/sections/list-section-editor'
import { TextSectionEditor } from '@/components/editor/sections/text-section-editor'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { SeccionCV } from '@/types/cv'

interface SectionManagerProps {
  sections: SeccionCV[]
  onChange: (sections: SeccionCV[]) => void
}

export function SectionManager({ sections, onChange }: SectionManagerProps) {
  // Estado para controlar qué secciones están colapsadas (por defecto: colapsadas)
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({})
  const parentRef = React.useRef<HTMLDivElement>(null)

  // Virtualizador TanStack para la lista dinámica de secciones
  const virtualizer = useVirtualizer({
    count: sections.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const sec = sections[index]
      if (!sec) return 52
      const key = sec.id || `section-${index}`
      const isCol = collapsed[key] ?? true
      if (isCol) return 52

      switch (sec.tipo) {
        case 'texto':
          return 200
        case 'entradas':
          return 140 + (sec.items?.length || 1) * 220
        case 'agrupado':
          return 120 + (sec.grupos?.length || 1) * 100
        case 'lista':
          return 120 + (sec.elementos?.length || 1) * 40
        default:
          return 280
      }
    },
    getItemKey: (index) => sections[index]?.id || `section-${index}`,
    overscan: 3,
    gap: 12,
  })

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => {
      const current = prev[id] ?? true
      return {
        ...prev,
        [id]: !current,
      }
    })
  }

  const handleCollapseAll = () => {
    const next: Record<string, boolean> = {}
    sections.forEach((s, idx) => {
      next[s.id || `section-${idx}`] = true
    })
    setCollapsed(next)
  }

  const handleExpandAll = () => {
    const next: Record<string, boolean> = {}
    sections.forEach((s, idx) => {
      next[s.id || `section-${idx}`] = false
    })
    setCollapsed(next)
  }

  const handleUpdateSection = (index: number, updated: SeccionCV) => {
    const newSections = [...sections]
    newSections[index] = updated
    onChange(newSections)
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newSections = [...sections]
    const temp = newSections[index - 1]
    newSections[index - 1] = newSections[index]
    newSections[index] = temp
    onChange(newSections)
    virtualizer.scrollToIndex(index - 1, { align: 'auto' })
  }

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return
    const newSections = [...sections]
    const temp = newSections[index + 1]
    newSections[index + 1] = newSections[index]
    newSections[index] = temp
    onChange(newSections)
    virtualizer.scrollToIndex(index + 1, { align: 'auto' })
  }

  const handleDeleteSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index)
    onChange(newSections)
  }

  const handleAddSection = (newSection: SeccionCV) => {
    onChange([...sections, newSection])
    if (newSection.id) {
      setCollapsed((prev) => ({
        ...prev,
        [newSection.id!]: false,
      }))
    }
    setTimeout(() => {
      virtualizer.scrollToIndex(sections.length, { align: 'end', behavior: 'smooth' })
    }, 60)
  }

  const renderSectionIcon = (tipo: SeccionCV['tipo']) => {
    switch (tipo) {
      case 'entradas':
        return <TableProperties className="size-3.5 text-primary" />
      case 'agrupado':
        return <FolderTree className="size-3.5 text-primary" />
      case 'lista':
        return <List className="size-3.5 text-primary" />
      case 'texto':
        return <FileText className="size-3.5 text-primary" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Cabecera del Gestor de Secciones */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-heading font-semibold text-sm tracking-wide uppercase text-foreground">
            Secciones del Documento ({sections.length})
          </h3>
          <span className="text-[11px] text-muted-foreground">
            El orden define la disposición visual en el CV
          </span>
        </div>

        {sections.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={handleCollapseAll}
              className="text-[11px] h-6 px-2 text-muted-foreground hover:text-foreground"
            >
              Plegar Todas
            </Button>
            <span className="text-border text-xs">|</span>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={handleExpandAll}
              className="text-[11px] h-6 px-2 text-muted-foreground hover:text-foreground"
            >
              Desplegar Todas
            </Button>
          </div>
        )}
      </div>

      {/* Riel Virtualizado de Secciones */}
      {sections.length === 0 ? (
        <div className="p-6 text-center rounded-lg border border-dashed border-border/80 text-muted-foreground">
          <p className="text-xs">No hay secciones en el CV. Añade una para comenzar.</p>
        </div>
      ) : (
        <div
          ref={parentRef}
          className="relative overflow-y-auto max-h-[calc(100vh-280px)] min-h-[140px] pr-1.5 focus:outline-none scrollbar-thin"
          tabIndex={-1}
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const sec = sections[virtualRow.index]
              if (!sec) return null
              const sectionKey = sec.id || `section-${virtualRow.index}`
              const isCollapsed = collapsed[sectionKey] ?? true

              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <Card className="border-border/70 bg-card/70 backdrop-blur-sm transition-all hover:border-border">
                    {/* Encabezado de la Sección con controles */}
                    <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between gap-2 border-b border-border/30">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {/* Controles de orden */}
                        <div className="flex items-center gap-0.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            disabled={virtualRow.index === 0}
                            onClick={() => handleMoveUp(virtualRow.index)}
                            title="Mover hacia arriba"
                            className="size-6 text-muted-foreground hover:text-foreground"
                          >
                            <ArrowUp className="size-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            disabled={virtualRow.index === sections.length - 1}
                            onClick={() => handleMoveDown(virtualRow.index)}
                            title="Mover hacia abajo"
                            className="size-6 text-muted-foreground hover:text-foreground"
                          >
                            <ArrowDown className="size-3" />
                          </Button>
                        </div>

                        {/* Icono del tipo */}
                        {renderSectionIcon(sec.tipo)}

                        {/* Título editable */}
                        <Input
                          value={sec.titulo}
                          onChange={(e) =>
                            handleUpdateSection(virtualRow.index, {
                              ...sec,
                              titulo: e.target.value.toUpperCase(),
                            })
                          }
                          className="h-7 text-xs font-heading font-bold uppercase tracking-wider bg-transparent border-transparent hover:border-border/60 focus:border-primary max-w-xs"
                        />

                        {/* Badge del tipo de maquetación */}
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 opacity-80 uppercase">
                          {sec.tipo}
                        </Badge>
                      </div>

                      {/* Acciones: Colapsar / Eliminar */}
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => toggleCollapse(sectionKey)}
                          title={isCollapsed ? 'Desplegar' : 'Plegar'}
                          className="size-6 text-muted-foreground"
                        >
                          {isCollapsed ? (
                            <ChevronDown className="size-3.5" />
                          ) : (
                            <ChevronUp className="size-3.5" />
                          )}
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleDeleteSection(virtualRow.index)}
                          title="Eliminar sección"
                          className="size-6 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </CardHeader>

                    {/* Contenido editable según el tipo */}
                    {!isCollapsed && (
                      <CardContent className="p-3 pt-2">
                        {sec.tipo === 'texto' && (
                          <TextSectionEditor
                            section={sec}
                            onChange={(updated) => handleUpdateSection(virtualRow.index, updated)}
                          />
                        )}
                        {sec.tipo === 'entradas' && (
                          <EntriesSectionEditor
                            section={sec}
                            onChange={(updated) => handleUpdateSection(virtualRow.index, updated)}
                          />
                        )}
                        {sec.tipo === 'agrupado' && (
                          <GroupedSectionEditor
                            section={sec}
                            onChange={(updated) => handleUpdateSection(virtualRow.index, updated)}
                          />
                        )}
                        {sec.tipo === 'lista' && (
                          <ListSectionEditor
                            section={sec}
                            onChange={(updated) => handleUpdateSection(virtualRow.index, updated)}
                          />
                        )}
                      </CardContent>
                    )}
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Botón para añadir nueva sección */}
      <div className="pt-2">
        <AddSectionDialog onAddSection={handleAddSection} />
      </div>
    </div>
  )
}
