import { Check, Laptop, Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="relative size-9 rounded-lg border-border/80 bg-surface-container-low/60 text-foreground transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-[0_0_15px_rgba(78,255,243,0.35)]"
            aria-label="Seleccionar tema"
            title="Seleccionar tema"
          >
            <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-primary" />
            <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-primary" />
            <span className="sr-only">Seleccionar tema</span>
          </Button>
        }
      />
      <DropdownMenuContent
        align="end"
        className="w-40 border-border/80 bg-popover/95 p-1 shadow-xl backdrop-blur-md"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex cursor-pointer items-center justify-between gap-2 px-2.5 py-1.5 text-xs font-medium"
        >
          <span className="flex items-center gap-2">
            <Sun className="size-4 text-amber-500" />
            <span>Claro</span>
          </span>
          {theme === "light" && <Check className="size-3.5 text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex cursor-pointer items-center justify-between gap-2 px-2.5 py-1.5 text-xs font-medium"
        >
          <span className="flex items-center gap-2">
            <Moon className="size-4 text-primary" />
            <span>Oscuro</span>
          </span>
          {theme === "dark" && <Check className="size-3.5 text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex cursor-pointer items-center justify-between gap-2 px-2.5 py-1.5 text-xs font-medium"
        >
          <span className="flex items-center gap-2">
            <Laptop className="size-4 text-muted-foreground" />
            <span>Sistema</span>
          </span>
          {theme === "system" && <Check className="size-3.5 text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
