import { Button } from '@/core/ui/button'
import { useCVStore } from '@/store'
import { SectionCard } from './section-card'
import { AddSectionDialog } from './add-section-dialog'
import { Plus, FoldVertical, UnfoldVertical, Layers } from 'lucide-react'
import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

export function SectionManager() {
  const sectionIds = useCVStore(
    useShallow((state) => state.cvData.secciones.map((sec) => sec.id))
  )
  const addSection = useCVStore((state) => state.addSection)
  const reorderSections = useCVStore((state) => state.reorderSections)

  const [isAddOpen, setIsAddOpen] = useState<boolean>(false)
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({})

  const toggleCollapse = (id: string) => {
    setCollapsedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const collapseAll = () => {
    const next: Record<string, boolean> = {}
    sectionIds.forEach((id) => {
      next[id] = true
    })
    setCollapsedMap(next)
  }

  const expandAll = () => {
    setCollapsedMap({})
  }

  return (
    <div className="space-y-3.5">
      {/* Barra de cabecera del gestor de secciones */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-6 rounded bg-primary/10 text-primary border border-primary/20">
            <Layers className="size-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-heading font-bold uppercase tracking-wider text-foreground">
              Secciones del CV ({sectionIds.length})
            </h2>
            <span className="text-[10px] text-muted-foreground font-mono">
              El orden aquí define la disposición tipográfica en Typst
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {sectionIds.length > 0 && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={collapseAll}
                className="text-[11px] text-muted-foreground hover:text-foreground h-7 px-2 gap-1"
                title="Plegar todas las secciones"
              >
                <FoldVertical className="size-3" />
                <span className="hidden sm:inline">Plegar</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={expandAll}
                className="text-[11px] text-muted-foreground hover:text-foreground h-7 px-2 gap-1"
                title="Desplegar todas las secciones"
              >
                <UnfoldVertical className="size-3" />
                <span className="hidden sm:inline">Desplegar</span>
              </Button>
            </>
          )}

          <Button
            type="button"
            variant="default"
            size="xs"
            onClick={() => setIsAddOpen(true)}
            className="text-xs font-heading font-semibold gap-1.5 h-7 px-2.5 shadow-sm"
          >
            <Plus className="size-3.5" />
            Añadir Sección
          </Button>
        </div>
      </div>

      {/* Lista de Secciones */}
      {sectionIds.length === 0 ? (
        <div className="p-8 text-center rounded-xl border border-dashed border-border/70 bg-surface-container-low/20 space-y-3">
          <p className="text-xs text-muted-foreground">
            No hay secciones en el documento. Añade tu experiencia, educación o habilidades para comenzar.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="text-xs text-primary gap-1.5"
          >
            <Plus className="size-3.5" />
            Añadir Primera Sección
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {sectionIds.map((id, index) => (
            <SectionCard
              key={id}
              sectionId={id}
              index={index}
              isFirst={index === 0}
              isLast={index === sectionIds.length - 1}
              isCollapsed={Boolean(collapsedMap[id])}
              onToggleCollapse={() => toggleCollapse(id)}
              onMoveUp={() => reorderSections(index, index - 1)}
              onMoveDown={() => reorderSections(index, index + 1)}
            />
          ))}
        </div>
      )}

      {/* Diálogo para añadir sección */}
      <AddSectionDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onAdd={(tipo, titulo) => {
          const newId = addSection(tipo, titulo)
          // Desplegar automáticamente la nueva sección
          setCollapsedMap((prev) => ({ ...prev, [newId]: false }))
        }}
      />
    </div>
  )
}
