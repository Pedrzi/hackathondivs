"use client"

import { useState } from "react"
import { Header } from "@/components/nutrition/header"
import { BottomNav } from "@/components/nutrition/bottom-nav"
import { Utensils, Weight, Save, CheckCircle2, Lightbulb, Droplets } from "lucide-react"

export default function BodyAdicionar() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.target as HTMLFormElement)
    const dados = Object.fromEntries(formData)
    
    // Aqui os dados incluirão 'alimento', 'quantidade', 'bebida' e 'ml'
    console.log("Salvando no banco de dados:", dados)
    
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative font-sans antialiased">
      <Header />
      
      <main className="p-4 pb-24 space-y-6">
        <header className="mt-2 space-y-1">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Registrar Consumo</h1>
          <p className="text-sm text-muted-foreground font-medium">Adicione o que você comeu e bebeu.</p>
        </header>

        {success ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300 shadow-sm">
            <div className="w-16 h-16 bg-[#e2fcfc] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#1ab394]" />
            </div>
            <h3 className="text-[#1ab394] text-lg font-bold">Sucesso!</h3>
            <p className="text-emerald-700 text-sm">Registro salvo no banco de dados.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-card p-6 rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-border/50 space-y-5">
            
            {/* Seção de Alimentos */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-primary uppercase tracking-widest ml-1">Sólidos</h2>
              <div className="space-y-3">
                <div className="relative">
                  <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    name="alimento"
                    placeholder="Nome do alimento"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/30 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    name="quantidade"
                    type="number"
                    placeholder="Quantidade em gramas (g)"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/30 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <hr className="border-border/50" />

            {/* Seção de Bebidas */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-[#5b8def] uppercase tracking-widest ml-1">Líquidos</h2>
              <div className="space-y-3">
                <div className="relative">
                  <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    name="bebida"
                    placeholder="Nome da bebida (ex: Água)"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/30 border border-border text-sm outline-none focus:ring-2 focus:ring-[#5b8def]/20 transition-all"
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">ML</div>
                  <input 
                    name="ml"
                    type="number"
                    placeholder="Volume em ml"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/30 border border-border text-sm outline-none focus:ring-2 focus:ring-[#5b8def]/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
            >
              <Save className="w-4 h-4" />
              {loading ? "Registrando..." : "Salvar no Diário"}
            </button>
          </form>
        )}

        <div className="bg-[#eef3fb] rounded-2xl p-5 border border-border/50 flex gap-4 items-start">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-foreground uppercase tracking-tight">Dica</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mantenha-se hidratado! Beber água entre as refeições ajuda na digestão e no controle do apetite.
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}