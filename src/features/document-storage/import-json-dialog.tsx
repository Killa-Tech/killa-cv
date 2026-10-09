import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/core/ui/dialog'
import { Button } from '@/core/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/core/ui/card'
import { useCVStore } from '@/store'
import { parseAndValidateCVData, type CVData } from '@/domain/cv'
import { UploadCloud, FileJson, CheckCircle2, AlertCircle, FileCode } from 'lucide-react'
import { useRef, useState } from 'react'

interface ImportJsonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportJsonDialog({ open, onOpenChange }: ImportJsonDialogProps) {
  const loadCVData = useCVStore((state) => state.loadCVData)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [fileName, setFileName] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<CVData | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const resetState = () => {
    setFileName(null)
    setParsedData(null)
    setValidationError(null)
    setIsDragging(false)
  }

  const handleFileProcess = (file: File) => {
    if (!file.name.endsWith('.json')) {
      setValidationError('El archivo debe tener extensión .json.')
      setParsedData(null)
      return
    }

    setFileName(file.name)
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const rawContent = e.target?.result as string
        const parsedJson = JSON.parse(rawContent)

        // Validación estricta con Zod
        const result = parseAndValidateCVData(parsedJson)

        if (result.success && result.data) {
          setParsedData(result.data)
          setValidationError(null)
        } else {
          setValidationError(result.error || 'La estructura no cumple con el esquema de Killa CV.')
          setParsedData(null)
        }
      } catch (err) {
        setValidationError(`El archivo no contiene un formato JSON válido: ${(err as Error).message}`)
        setParsedData(null)
      }
    }

    reader.readAsText(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileProcess(file)
    }
    e.target.value = ''
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileProcess(file)
    }
  }

  const handleConfirmImport = () => {
    if (!parsedData) return
    loadCVData(parsedData)
    resetState()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetState()
        onOpenChange(next)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <FileJson className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-heading font-bold text-foreground">
                Importar Currículum JSON
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Carga un archivo .json validado conforme a cv.schema.json.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Zona de Arrastrar y Soltar */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer p-6 rounded-xl border-2 border-dashed text-center transition-all ${
              isDragging
                ? 'border-primary bg-primary/10 shadow-cyan-glow'
                : 'border-border/70 hover:border-primary/50 hover:bg-surface-container-low/40 bg-surface-container-low/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleInputChange}
            />

            <div className="flex flex-col items-center justify-center gap-2">
              <UploadCloud className="size-8 text-primary/70 animate-bounce" />
              <div className="space-y-1">
                <p className="text-xs font-heading font-medium text-foreground">
                  Arrastra tu archivo aquí o haz clic para explorar
                </p>
                <p className="text-[11px] text-muted-foreground font-mono">
                  Soporta esquemas estándar de Killa CV
                </p>
              </div>
            </div>
          </div>

          {/* Resultado de la Validación Zod */}
          {fileName && (
            <div className="p-3 rounded-lg bg-surface-container-low border border-border/50 text-xs space-y-2">
              <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                <FileCode className="size-3.5 text-primary" />
                <span className="truncate flex-1">{fileName}</span>
              </div>

              {parsedData && (
                <div className="flex items-center gap-2 text-primary font-medium text-xs">
                  <CheckCircle2 className="size-4" />
                  <span>
                    Validado con éxito: {parsedData.datos_personales.nombre_completo || 'Candidato'} (
                    {parsedData.secciones.length} secciones)
                  </span>
                </div>
              )}
            </div>
          )}

          {validationError && (
            <Card className="border-destructive/40 bg-destructive/10 text-destructive-foreground">
              <CardHeader className="py-2.5 px-3 flex flex-row items-start gap-2">
                <AlertCircle className="size-4 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-1 min-w-0">
                  <CardTitle className="text-xs font-mono font-bold text-destructive">
                    Error de Validación:
                  </CardTitle>
                  <CardDescription className="text-xs text-destructive font-mono whitespace-pre-wrap wrap-break-word">
                    {validationError}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          )}

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => onOpenChange(false)}
              className="text-xs text-muted-foreground"
            >
              Cancelar
            </Button>

            <Button
              type="button"
              variant="default"
              size="xs"
              onClick={handleConfirmImport}
              disabled={!parsedData}
              className="text-xs font-heading font-semibold"
            >
              Confirmar e Importar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
