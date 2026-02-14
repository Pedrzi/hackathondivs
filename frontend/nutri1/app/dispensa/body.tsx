"use client"

import { Header } from "@/components/nutrition/header"
import { BottomNav } from "@/components/nutrition/bottom-nav"
import { Package, Search, Plus, ChevronRight, AlertTriangle } from "lucide-react"

export default function BodyDispensa() {
  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative font-sans antialiased">
      <Header />

      <main className="pb-24 pt-4 px-4 space-y-6">
        <header className="flex flex-col gap-1 mt-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Minha Dispensa</h1>
          <p className="text-sm text-muted-foreground font-medium">Controle de estoque e mantimentos</p>
        </header>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar na dispensa..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Itens Recentes</h2>
          
          <div className="bg-card rounded-2xl p-4 shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-border/50 flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Arroz Integral</h3>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Restam 1.2kg</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">ESTOQUE OK</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </div>
          </div>
        </div>

        <button className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          Novo Alimento
        </button>
      </main>

      <BottomNav />
    </div>
  )
}