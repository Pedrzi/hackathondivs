"use client"

import { Home, UtensilsCrossed, BarChart3, User, Plus } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { icon: Home, label: "Home", href: "/components/nutrition" },
  { icon: UtensilsCrossed, label: "Despensa", href: "/dispensa" },
  { icon: null, label: "Add", href: "#" },
  { icon: BarChart3, label: "Stats", href: "#" },
  { icon: User, label: "Profile", href: "#" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-60 bg-card/90 backdrop-blur-xl border-t border-border"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2 relative">
        {navItems.map((item) => {
          // Botão Central de "Add" (Mantido como botão para ações internas)
          if (!item.icon) {
            return (
              <button
                key={item.label}
                type="button"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-primary shadow-lg shadow-primary/30 -mt-6 hover:brightness-110 active:scale-95 transition-all z-70 relative"
                aria-label="Add meal"
              >
                <Plus className="w-6 h-6 text-primary-foreground" />
              </button>
            )
          }

          // Verificação de aba ativa baseada na URL atual
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.label}
              href={item.href}
              prefetch={true}
              className={`relative z-70 flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}