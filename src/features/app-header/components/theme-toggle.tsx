import { useTheme } from '@/app/providers/theme-provider'
import { Button } from '@/core/ui/button'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const isDark = theme === 'dark'

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-container-high transition-colors"
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo Cyber Lunar (oscuro)'}
    >
      {isDark ? <Sun className="size-3.5 text-primary" /> : <Moon className="size-3.5" />}
    </Button>
  )
}
