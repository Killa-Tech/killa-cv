import * as React from "react"
import { cn } from "cn"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "./theme-toggle"

export function Header({
  className,
  children,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="header"
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md transition-colors duration-300",
        className
      )}
      {...props}
    >
      {/* Línea superior con gradiente cian característico de Cyber Lunar */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-primary/80 via-primary/30 to-transparent" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {children ?? (
          <>
            <HeaderBrand />
            <HeaderActions>
              <Separator orientation="vertical" className="hidden h-5 sm:block" />
              <ThemeToggle />
            </HeaderActions>
          </>
        )}
      </div>
    </header>
  )
}

export function HeaderBrand({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="header-brand"
      className={cn("flex items-center gap-3", className)}
      {...props}
    >
      <Avatar className="size-9 overflow-hidden rounded-xl border border-primary/30 bg-primary/5 p-0.5 shadow-[0_0_15px_rgba(78,255,243,0.25)] transition-transform duration-200 hover:scale-105 after:hidden">
        <AvatarImage
          src="/logo-luna.png"
          alt="Killa CV Logo"
          className="size-full rounded-lg object-contain"
        />
      </Avatar>
      <div className="flex items-center gap-2.5">
        <h1 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          killa-cv
        </h1>
        <Badge variant="cyber" className="hidden py-0.5 text-[10px] sm:inline-flex">
          v1.0
        </Badge>
      </div>
    </div>
  )
}

export function HeaderNav({
  className,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="header-nav"
      className={cn("hidden items-center gap-6 text-sm font-medium md:flex", className)}
      {...props}
    />
  )
}

export function HeaderActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="header-actions"
      className={cn("flex items-center gap-3", className)}
      {...props}
    />
  )
}

export default Header
