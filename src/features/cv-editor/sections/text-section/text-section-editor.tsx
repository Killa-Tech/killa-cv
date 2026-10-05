import { Textarea } from '@/core/ui/textarea'
import type { SectionEditorProps, SeccionTexto } from '@/domain/cv'

export function TextSectionEditor({
  section,
  onUpdate,
}: SectionEditorProps<SeccionTexto>) {
  const charCount = section.contenido ? section.contenido.length : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Soporta Markdown básico (*negrita*, _cursiva_, enlaces).</span>
        <span className="font-mono">{charCount} caracteres</span>
      </div>

      <Textarea
        value={section.contenido || ''}
        onChange={(e) => onUpdate({ contenido: e.target.value })}
        placeholder="Escribe tu perfil profesional, resumen o carta de presentación en formato párrafo narrativo..."
        className="min-h-32 text-xs leading-relaxed font-sans"
      />
    </div>
  )
}
