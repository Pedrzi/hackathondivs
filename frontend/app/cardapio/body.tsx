"use client"

import { useState } from "react"
import Image from "next/image"
import { Header } from "@/components/nutrition/header"
import { BottomNav } from "@/components/nutrition/bottom-nav"
import { Clock, Plus, Search, ChevronDown, ChevronUp } from "lucide-react"

// Estrutura de dados simulando o que viria do banco de dados/nutricionista 
const mockData = {
  breakfast: [
    { id: 1, name: "Bowl de Frutas", kcal: 320, time: "15 min", image: "/images/meal-smoothie.jpg" },
    { id: 2, name: "Panqueca de Aveia", kcal: 280, time: "10 min", image: "" },
    { id: 3, name: "Ovos Mexidos", kcal: 210, time: "5 min", image: "" },
  ],
  lunch: [
    { id: 4, name: "Frango Grelhado", kcal: 450, time: "25 min", image: "/images/meal-chicken.jpg" },
    { id: 5, name: "Salada Mediterrânea", kcal: 380, time: "15 min", image: "/images/meal-salad.jpg" },
    { id: 6, name: "Peixe Assado", kcal: 410, time: "30 min", image: "" },
  ],
  dinner: [
    { id: 7, name: "Sopa de Legumes", kcal: 180, time: "20 min", image: "" },
    { id: 8, name: "Omelete de Espinafre", kcal: 240, time: "10 min", image: "" },
  ],
  snack: [
    { id: 9, name: "Iogurte Natural", kcal: 120, time: "2 min", image: "" },
    { id: 10, name: "Mix de Castanhas", kcal: 160, time: "1 min", image: "" },
  ],
}

const categorias = [
  { id: 'breakfast', label: 'Breakfasts', color: '#5b8def', bg: '#e5f1ff' },
  { id: 'lunch', label: 'Lunchs', color: '#1ab394', bg: '#e2fcfc' },
  { id: 'dinner', label: 'Dinners', color: '#e8a838', bg: '#fef3e2' },
  { id: 'snack', label: 'Snacks', color: '#1ab394', bg: '#e2fcfc' },
]

export default function BodyCardapios() {
  // Estado para controlar quais categorias estão expandidas
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative font-sans antialiased">
      <Header />

      <main className="pb-24 pt-4 px-4 space-y-6">
        <header className="mt-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Explorar Cardápios</h1>
          <p className="text-sm text-muted-foreground font-medium">Sugestões do seu nutricionista.</p>
        </header>

        {/* Busca Semântica baseada no OnboardingForm [cite: 13] */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar receitas..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        {categorias.map((cat) => {
          const items = mockData[cat.id as keyof typeof mockData] || []
          const isExpanded = expanded[cat.id]
          // Mostra apenas 1 item se não estiver expandido
          const visibleItems = isExpanded ? items : items.slice(0, 1)

          return (
            <section key={cat.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-foreground">{cat.label}</h2>
                <button 
                  onClick={() => toggleExpand(cat.id)}
                  className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 transition-all active:scale-95"
                  style={{ color: cat.color, backgroundColor: cat.bg }}
                >
                  {isExpanded ? (
                    <>Ver menos <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>Ver mais <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>
              </div>

              <div className="space-y-3">
                {visibleItems.map((meal) => (
                  <div 
                    key={meal.id} 
                    className="bg-card rounded-2xl p-4 shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-border/40 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-muted overflow-hidden relative shrink-0 border border-border/20">
                        {meal.image ? (
                          <Image
                            src={meal.image}
                            alt={meal.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          // Placeholder caso o nutricionista ainda não tenha enviado a foto 
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                            <Plus className="w-4 h-4 text-slate-300" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground leading-tight">{meal.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-primary">{meal.kcal} kcal</span>
                          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground font-medium">
                            <Clock className="w-3 h-3" /> {meal.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90 transition-transform">
                      <Plus className="w-5 h-5 text-primary-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </main>

      <BottomNav />
    </div>
  )
}