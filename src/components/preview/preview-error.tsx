import { AlertTriangle } from 'lucide-react'

interface PreviewErrorProps {
  error: string
}

export function PreviewError({ error }: PreviewErrorProps) {
  return (
    <div className="w-full max-w-md p-4 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive-foreground space-y-2">
      <div className="flex items-center gap-2 font-heading font-semibold text-xs text-destructive">
        <AlertTriangle className="size-4" />
        <span>DIAGNÓSTICO DEL COMPILADOR TYPST</span>
      </div>
      <pre className="text-[11px] font-mono whitespace-pre-wrap overflow-x-auto p-2 rounded bg-black/40 text-destructive/90 max-h-60">
        {error}
      </pre>
      <p className="text-[11px] text-muted-foreground">
        Revisa los campos del formulario para corregir el valor inválido.
      </p>
    </div>
  )
}
