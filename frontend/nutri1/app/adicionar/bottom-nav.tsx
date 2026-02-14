"use client"

import { Home, UtensilsCrossed, BarChart3, User, Plus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: UtensilsCrossed, label: "Dispensa", href: "/dispensa" },
  { icon: null, label: "Add", href: "/adicionar" }, // Agora aponta para a rota de adicionar
  { icon: BarChart3, label: "Stats", href: "#" },
  { icon: User, label: "Profile", href: "#" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-100 bg-card/90 backdrop-blur-xl border-t border-border"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2 relative">
        {navItems.map((item) => {
          // Botão Central de "Add" - Reforçado com Link Invisível
          if (!item.icon) {
            return (
              <div key={item.label} className="relative flex flex-col items-center">
                <button
                  type="button"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-primary shadow-lg shadow-primary/30 -mt-6 hover:brightness-110 active:scale-95 transition-all z-110"
                >
                  <Plus className="w-6 h-6 text-primary-foreground" />
                </button>
                {/* Camada invisível para o clique no botão central */}
                <Link
                  href={item.href}
                  className="absolute -top-6 inset-x-0 bottom-0 z-120 cursor-pointer"
                  aria-label="Adicionar Alimento"
                >
                  <div className="w-full h-full" />
                </Link>
                <span className="text-[10px] font-medium text-muted-foreground mt-0.5">{item.label}</span>
              </div>
            )
          }

          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <div key={item.label} className="relative flex flex-col items-center gap-0.5 py-1 px-3 min-w-16">
              <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {item.label}
              </span>

              <Link
                href={item.href}
                prefetch={true}
                className="absolute inset-0 z-120 cursor-pointer"
              >
                <div className="w-full h-full" />
              </Link>
            </div>
          )
        })}
      </div>
    </nav>
  )
}