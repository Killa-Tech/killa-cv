import * as React from 'react'
import { Check, Copy, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface CliCommandDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliCommand: string
}

export function CliCommandDialog({ open, onOpenChange, cliCommand }: CliCommandDialogProps) {
  const [copiedCLI, setCopiedCLI] = React.useState(false)

  const handleCopyCLI = () => {
    navigator.clipboard.writeText(cliCommand)
    setCopiedCLI(true)
    setTimeout(() => setCopiedCLI(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 border-border/80">
        <DialogHeader>
          <DialogTitle className="font-heading text-base flex items-center gap-2">
            <Terminal className="size-4 text-primary" />
            Compilación con Typst CLI
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Puedes compilar este CV directamente en tu terminal de Linux con el siguiente comando:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="relative p-3 rounded-lg bg-surface-container-lowest border border-border/60 font-mono text-xs text-primary overflow-x-auto">
            <code>{cliCommand}</code>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyCLI}
            className="w-full gap-1.5 text-xs"
          >
            {copiedCLI ? (
              <>
                <Check className="size-3.5 text-primary" />
                ¡Comando Copiado!
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                Copiar Comando
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CliCommandDialog
