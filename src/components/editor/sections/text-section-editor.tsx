import { Textarea } from '@/components/ui/textarea'
import type { SeccionTexto } from '@/types/cv'

interface TextSectionEditorProps {
  section: SeccionTexto
  onChange: (updated: SeccionTexto) => void
}

export function TextSectionEditor({ section, onChange }: TextSectionEditorProps) {
  return (
    <div className="space-y-1.5 pt-1">
      <Textarea
        value={section.contenido}
        onChange={(e) =>
          onChange({
            ...section,
            contenido: e.target.value,
          })
        }
        placeholder="Escribe el contenido narrativo de la sección aquí (ej. resumen profesional, objetivos, carta)..."
        className="min-h-[100px] text-xs leading-relaxed bg-surface-container-lowest/50"
      />
      <p className="text-[11px] text-muted-foreground text-right">
        Se renderizará como un bloque de texto corrido y justificado en Typst.
      </p>
    </div>
  )
}
