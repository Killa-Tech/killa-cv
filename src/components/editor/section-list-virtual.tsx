import * as React from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useSortable } from '@dnd-kit/sortable'
import { SectionCardHeader } from './section-card-header'
import { SectionContentEditor } from './section-content-editor'
import { Card } from '@/components/ui/card'
import type { SeccionCV } from '@/types/cv'

export interface SectionListProps {
  sections: SeccionCV[]
  collapsed: Record<string, boolean>
  onToggleCollapse: (id: string) => void
  onUpdateSection: (index: number, updated: SeccionCV) => void
  onDeleteSection: (index: number) => void
}

interface SortableVirtualItemProps {
  id: string
  index: number
  section: SeccionCV
  virtualRow: any
  isCollapsed: boolean
  virtualizer: any
  onToggleCollapse: () => void
  onUpdateSection: (index: number, updated: SeccionCV) => void
  onDeleteSection: (index: number) => void
}

function SortableVirtualItem({
  id,
  index,
  section,
  virtualRow,
  isCollapsed,
  virtualizer,
  onToggleCollapse,
  onUpdateSection,
  onDeleteSection,
}: SortableVirtualItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    transform: `translateY(${virtualRow.start}px) ${
      transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : ''
    }`,
    transition: transition || undefined,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.8 : 1,
  }

  return (
    <div
      ref={(node) => {
        virtualizer.measureElement(node)
        setNodeRef(node)
      }}
      data-index={virtualRow.index}
      style={style}
    >
      <Card
        className={`border-border/70 bg-card/70 backdrop-blur-sm transition-all hover:border-border ${
          isDragging ? 'shadow-xl border-primary/50' : ''
        }`}
      >
        <SectionCardHeader
          tipo={section.tipo}
          titulo={section.titulo}
          isCollapsed={isCollapsed}
          dragHandleProps={{ ...attributes, ...listeners }}
          onTitleChange={(newTitle) => onUpdateSection(index, { ...section, titulo: newTitle })}
          onToggleCollapse={onToggleCollapse}
          onDelete={() => onDeleteSection(index)}
        />
        {!isCollapsed && (
          <SectionContentEditor
            section={section}
            onChange={(updated) => onUpdateSection(index, updated)}
          />
        )}
      </Card>
    </div>
  )
}

export function SectionListVirtual({
  sections,
  collapsed,
  onToggleCollapse,
  onUpdateSection,
  onDeleteSection,
}: SectionListProps) {
  const parentRef = React.useRef<HTMLDivElement>(null)

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

  return (
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
            <SortableVirtualItem
              key={virtualRow.key}
              id={sectionKey}
              index={virtualRow.index}
              section={sec}
              virtualRow={virtualRow}
              isCollapsed={isCollapsed}
              virtualizer={virtualizer}
              onToggleCollapse={() => onToggleCollapse(sectionKey)}
              onUpdateSection={onUpdateSection}
              onDeleteSection={onDeleteSection}
            />
          )
        })}
      </div>
    </div>
  )
}
