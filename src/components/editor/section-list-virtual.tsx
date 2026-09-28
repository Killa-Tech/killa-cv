import * as React from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { SectionCardHeader } from './section-card-header'
import { SectionContentEditor } from './section-content-editor'
import { Card } from '@/components/ui/card'
import type { SeccionCV } from '@/types/cv'

export interface SectionListProps {
  sections: SeccionCV[]
  collapsed: Record<string, boolean>
  onToggleCollapse: (id: string) => void
  onUpdateSection: (index: number, updated: SeccionCV) => void
  onMoveUp: (index: number) => void
  onMoveDown: (index: number) => void
  onDeleteSection: (index: number) => void
}

export function SectionListVirtual({
  sections,
  collapsed,
  onToggleCollapse,
  onUpdateSection,
  onMoveUp,
  onMoveDown,
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
                <SectionCardHeader
                  index={virtualRow.index}
                  totalSections={sections.length}
                  tipo={sec.tipo}
                  titulo={sec.titulo}
                  isCollapsed={isCollapsed}
                  onMoveUp={() => onMoveUp(virtualRow.index)}
                  onMoveDown={() => onMoveDown(virtualRow.index)}
                  onTitleChange={(newTitle) =>
                    onUpdateSection(virtualRow.index, { ...sec, titulo: newTitle })
                  }
                  onToggleCollapse={() => onToggleCollapse(sectionKey)}
                  onDelete={() => onDeleteSection(virtualRow.index)}
                />

                {!isCollapsed && (
                  <SectionContentEditor
                    section={sec}
                    onChange={(updated) => onUpdateSection(virtualRow.index, updated)}
                  />
                )}
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
