import { AlertCircle, Loader2 } from 'lucide-react'

interface CompilerStatusBadgeProps {
  isCompiling?: boolean
  error?: string | null
  typstVersion?: string | null
}

export function CompilerStatusBadge({
  isCompiling = false,
  error = null,
  typstVersion,
}: CompilerStatusBadgeProps) {
  return (
    <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high/60 border border-border/50 text-[10px] font-mono select-none">
      {isCompiling ? (
        <>
          <Loader2 className="size-3 text-primary animate-spin" />
          <span className="text-primary font-medium">Compilando...</span>
        </>
      ) : error ? (
        <>
          <AlertCircle className="size-3 text-destructive" />
          <span className="text-destructive font-medium">Typst Error</span>
        </>
      ) : (
        <>
          <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
          </span>
          <span className="text-muted-foreground">
            Online <span className="text-border">/</span> {typstVersion ? `${typstVersion} Ready` : 'WASM Ready'}
          </span>
        </>
      )}
    </div>
  )
}

