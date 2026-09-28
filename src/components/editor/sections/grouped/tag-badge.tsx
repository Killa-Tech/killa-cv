import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface TagBadgeProps {
  label: string
  onRemove: () => void
}

export function TagBadge({ label, onRemove }: TagBadgeProps) {
  return (
    <Badge
      variant="outline"
      className="gap-1 text-xs py-0.5 px-2 bg-primary/10 border-primary/30 text-foreground"
    >
      <span>{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full hover:text-destructive focus:outline-none"
        title={`Eliminar ${label}`}
      >
        <X className="size-2.5" />
      </button>
    </Badge>
  )
}
