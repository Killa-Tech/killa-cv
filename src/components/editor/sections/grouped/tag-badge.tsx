import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={onRemove}
        className="size-4 hover:bg-transparent rounded-full text-muted-foreground hover:text-destructive focus:outline-none"
        title={`Eliminar ${label}`}
      >
        <X className="size-2.5" />
      </Button>
    </Badge>
  )
}
