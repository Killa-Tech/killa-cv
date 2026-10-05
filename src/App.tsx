import { ThemeProvider } from '@/app/providers/theme-provider'
import { Button } from '@/core/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { Badge } from '@/core/ui/badge'

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="killa-ui-theme">
      <div className="relative min-h-dvh flex flex-col items-center justify-center p-6 bg-background font-sans text-foreground overflow-hidden">
        {/* Resplandor ambiental de fondo Cyber Lunar */}
        <div className="pointer-events-none fixed -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

        <Card className="w-full max-w-lg border-border/80 bg-card/80 backdrop-blur-md shadow-cyan-glow">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center">
              <Badge variant="outline" className="border-primary/40 text-primary font-mono text-xs uppercase tracking-wider">
                Fase 0 Completada
              </Badge>
            </div>
            <CardTitle className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Killa CV — Workbench
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Estructura Feature-Based inicializada con éxito. Preparado para la Fase 1 (Dominio y Modelado de Datos).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-xs text-muted-foreground font-mono">
              Tokens de estilo, tipografías Space Grotesk / Inter y Shadcn UI activos en src/core/ui.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="default">Botón Primario</Button>
              <Button variant="outline">Botón Secundario</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  )
}

export default App
