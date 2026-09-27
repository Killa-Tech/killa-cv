import * as React from 'react'
import {
  Eraser,
  FileDown,
  FileUp,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EditorToolbarProps {
  onClearData: () => void
  onResetDefault: () => void
  onExportJSON: () => void
  onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function EditorToolbar({
  onClearData,
  onResetDefault,
  onExportJSON,
  onImportJSON,
}: EditorToolbarProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl border border-border/70 bg-card/70 backdrop-blur-md shadow-md">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-primary" />
        <span className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
          Gestión de Datos
        </span>
      </div>

      <div className="flex items-center flex-wrap gap-1.5">
        {/* Input oculto para importar JSON */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={onImportJSON}
          className="hidden"
        />

        {/* Botón Importar JSON */}
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={() => fileInputRef.current?.click()}
          className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
          title="Cargar archivo cv.json existente"
        >
          <FileUp className="size-3 text-primary" />
          <span>Importar</span>
        </Button>

        {/* Botón Exportar JSON */}
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={onExportJSON}
          className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
          title="Guardar archivo cv.json en tu disco"
        >
          <FileDown className="size-3 text-primary" />
          <span>Exportar</span>
        </Button>

        {/* Botón Cargar Ejemplo */}
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onResetDefault}
          className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
          title="Cargar perfil genérico de demostración (John Doe)"
        >
          <RotateCcw className="size-3" />
          <span>Ejemplo</span>
        </Button>

        <span className="text-border text-xs mx-0.5">|</span>

        {/* Botón Limpiar Datos */}
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onClearData}
          className="h-7 text-xs gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
          title="Vaciar todos los campos y empezar un CV en blanco"
        >
          <Eraser className="size-3" />
          <span>Limpiar Datos</span>
        </Button>
      </div>
    </div>
  )
}
