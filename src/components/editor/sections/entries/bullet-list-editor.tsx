import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface BulletListEditorProps {
  vinetas?: string[]
  onChange: (vinetas: string[]) => void
}

export function BulletListEditor({ vinetas = [], onChange }: BulletListEditorProps) {
  const handleAddVineta = () => {
    onChange([...vinetas, ''])
  }

  const handleVinetaChange = (index: number, val: string) => {
    const next = [...vinetas]
    next[index] = val
    onChange(next)
  }

  const handleRemoveVineta = (index: number) => {
    onChange(vinetas.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex items-center justify-between">
        <Label className="text-[11px] font-semibold text-foreground">
          Logros & Responsabilidades (Viñetas Harvard)
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="text-[11px] h-6 px-1.5 gap-1 text-primary"
          onClick={handleAddVineta}
        >
          <Plus className="size-3" />
          Añadir Viñeta
        </Button>
      </div>

      <div className="space-y-1.5">
        {vinetas.map((vineta, vinIdx) => (
          <div key={vinIdx} className="flex items-center gap-1.5">
            <span className="text-primary text-xs select-none">•</span>
            <Input
              value={vineta}
              onChange={(e) => handleVinetaChange(vinIdx, e.target.value)}
              placeholder="Logro cuantificable (ej. 'Incrementé el rendimiento en un 30% mediante...')"
              className="h-7 text-xs bg-background/50 flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => handleRemoveVineta(vinIdx)}
              className="hover:text-destructive"
              title="Eliminar viñeta"
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
