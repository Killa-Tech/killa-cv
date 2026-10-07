import { Button } from '@/core/ui/button'
import { Input } from '@/core/ui/input'
import { Plus, Trash2 } from 'lucide-react'

interface BulletListEditorProps {
  bullets: string[]
  onChange: (bullets: string[]) => void
}

export function BulletListEditor({ bullets, onChange }: BulletListEditorProps) {
  const handleBulletChange = (index: number, val: string) => {
    const next = [...bullets]
    next[index] = val
    onChange(next)
  }

  const handleAddBullet = (insertIndex?: number) => {
    const next = [...bullets]
    if (typeof insertIndex === 'number') {
      next.splice(insertIndex + 1, 0, '')
    } else {
      next.push('')
    }
    onChange(next)
  }

  const handleRemoveBullet = (index: number) => {
    const next = bullets.filter((_, i) => i !== index)
    onChange(next)
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddBullet(index)
    } else if (e.key === 'Backspace' && bullets[index] === '' && bullets.length > 1) {
      e.preventDefault()
      handleRemoveBullet(index)
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-heading font-medium text-muted-foreground uppercase tracking-wider">
          Logros y Responsabilidades ({bullets.length})
        </span>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => handleAddBullet()}
          className="text-[11px] text-primary hover:bg-primary/10 gap-1 h-6 px-1.5"
        >
          <Plus className="size-3" />
          Añadir Viñeta
        </Button>
      </div>

      {bullets.length === 0 ? (
        <div className="p-2 text-center rounded border border-dashed border-border/50 text-[11px] text-muted-foreground">
          Sin viñetas. Haz clic en "Añadir Viñeta" para destacar tus logros.
        </div>
      ) : (
        <div className="space-y-1.5">
          {bullets.map((bullet, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="text-primary font-bold text-xs select-none">•</span>
              <Input
                value={bullet}
                onChange={(e) => handleBulletChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                placeholder="Logro cuantificable (ej: Reduje la latencia de APIs en 35%...)"
                className="h-7 text-xs flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => handleRemoveBullet(idx)}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 size-6"
                title="Eliminar viñeta"
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
