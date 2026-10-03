import * as React from 'react'
import { Plus } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SectionListVirtual } from '@/components/editor/section-list-virtual'
import { Button } from '@/components/ui/button'
import type { SeccionCV } from '@/types/cv'

const AddSectionDialog = React.lazy(() => import('@/components/editor/add-section-dialog'))

interface SectionManagerProps {
  sections: SeccionCV[]
  onChange: (sections: SeccionCV[]) => void
}

export function SectionManager({ sections, onChange }: SectionManagerProps) {
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({})

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }))
  }

  const setAllCollapsed = (isCol: boolean) => {
    const next: Record<string, boolean> = {}
    sections.forEach((s, idx) => {
      next[s.id || `section-${idx}`] = isCol
    })
    setCollapsed(next)
  }

  const handleUpdateSection = (index: number, updated: SeccionCV) => {
    const next = [...sections]
    next[index] = updated
    onChange(next)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s, idx) => (s.id || `section-${idx}`) === active.id)
      const newIndex = sections.findIndex((s, idx) => (s.id || `section-${idx}`) === over.id)
      if (oldIndex !== -1 && newIndex !== -1) {
        onChange(arrayMove(sections, oldIndex, newIndex))
      }
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDeleteSection = (index: number) => {
    onChange(sections.filter((_, i) => i !== index))
  }

  const handleAddSection = (newSection: SeccionCV) => {
    onChange([...sections, newSection])
    if (newSection.id) {
      setCollapsed((prev) => ({ ...prev, [newSection.id!]: false }))
    }
  }

  return (
    <div className="space-y-4">
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
              onClick={() => setAllCollapsed(true)}
              className="text-[11px] h-6 px-2 text-muted-foreground hover:text-foreground"
            >
              Plegar Todas
            </Button>
            <span className="text-border text-xs">|</span>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => setAllCollapsed(false)}
              className="text-[11px] h-6 px-2 text-muted-foreground hover:text-foreground"
            >
              Desplegar Todas
            </Button>
          </div>
        )}
      </div>

      {sections.length === 0 ? (
        <div className="p-6 text-center rounded-lg border border-dashed border-border/80 text-muted-foreground">
          <p className="text-xs">No hay secciones en el CV. Añade una para comenzar.</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((s, idx) => s.id || `section-${idx}`)}
            strategy={verticalListSortingStrategy}
          >
            <SectionListVirtual
              sections={sections}
              collapsed={collapsed}
              onToggleCollapse={toggleCollapse}
              onUpdateSection={handleUpdateSection}
              onDeleteSection={handleDeleteSection}
            />
          </SortableContext>
        </DndContext>
      )}

      <div className="pt-2">
        <React.Suspense
          fallback={
            <Button
              type="button"
              variant="default"
              disabled
              className="w-full gap-2 shadow-cyan-glow"
            >
              <Plus className="size-4" />
              Añadir Nueva Sección al CV
            </Button>
          }
        >
          <AddSectionDialog onAddSection={handleAddSection} />
        </React.Suspense>
      </div>
    </div>
  )
}
