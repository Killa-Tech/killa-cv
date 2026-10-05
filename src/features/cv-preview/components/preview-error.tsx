import { Card, CardHeader, CardTitle, CardDescription } from '@/core/ui/card'
import { AlertCircle } from 'lucide-react'

interface PreviewErrorProps {
  error: string
}

export function PreviewError({ error }: PreviewErrorProps) {
  return (
    <Card className="w-full max-w-2xl border-destructive/50 bg-destructive/10 text-destructive-foreground shadow-sm">
      <CardHeader className="py-2.5 px-4 flex flex-row items-start gap-2.5">
        <AlertCircle className="size-4 text-destructive shrink-0 mt-0.5" />
        <div className="space-y-1 min-w-0 flex-1">
          <CardTitle className="text-xs font-mono font-bold tracking-tight text-destructive">
            Error de Compilación Typst:
          </CardTitle>
          <CardDescription className="text-xs text-destructive/90 font-mono whitespace-pre-wrap break-words leading-relaxed">
            {error}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}
