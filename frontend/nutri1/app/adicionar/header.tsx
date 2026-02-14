"use client"

import { Globe, Bell, Menu, Package } from "lucide-react" // Importei o ícone Package para a Dispensa
import { useState } from "react"
import Link from "next/link" // Importante para navegação no Next.js

export function Header() {
  const [notificationCount] = useState(3)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-card/80 border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto relative">
        
        {/* Botão do Menu com Toggle */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>

          {/* Menu Dropdown Simples */}
          {isMenuOpen && (
            <>
              {/* Overlay para fechar o menu ao clicar fora */}
              <div 
                className="fixed inset-0 z-[-1]" 
                onClick={() => setIsMenuOpen(false)} 
              />
              <div className="absolute left-0 mt-2 w-48 rounded-xl border border-border bg-popover p-2 shadow-lg animate-in fade-in zoom-in duration-200">
                <Link 
                  href="/dispensa" // Caminho da sua nova página
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-sm font-medium text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package className="w-4 h-4" />
                  Dispensa
                </Link>
                {/* Você pode adicionar mais itens aqui no futuro */}
              </div>
            </>
          )}
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm tracking-tight">N</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">Nutri</span>
        </div>

        {/* Ações da Direita */}
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted">
            <Globe className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <button className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-muted">
            <Bell className="w-5 h-5 text-muted-foreground" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}