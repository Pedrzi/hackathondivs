"use client"

import { useState } from "react"
import { Header } from "@/components/nutrition/header"
import { BottomNav } from "@/components/nutrition/bottom-nav"
import { 
  Utensils, 
  Weight, 
  Save, 
  CheckCircle2, 
  Droplets, 
  Plus, 
  Trash2,
  ChevronDown,
  ChevronUp
} from "lucide-react"

interface ItemConsumo {
  id: number;
  nome: string;
  quantidade: number;
}

export default function BodyAdicionar() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  // Listas de itens já "guardados"
  const [comidasGuardadas, setComidasGuardadas] = useState<ItemConsumo[]>([])
  const [bebidasGuardadas, setBebidasGuardadas] = useState<ItemConsumo[]>([])

  // Estados dos inputs atuais
  const [inputComida, setInputComida] = useState({ nome: "", qtd: "" })
  const [inputBebida, setInputBebida] = useState({ nome: "", qtd: "" })

  // Controle de expansão das listas
  const [showComidas, setShowComidas] = useState(true)
  const [showBebidas, setShowBebidas] = useState(true)

  const adicionarComida = () => {
    if (!inputComida.nome || !inputComida.qtd || Number(inputComida.qtd) <= 0) return
    setComidasGuardadas([...comidasGuardadas, { id: Date.now(), nome: inputComida.nome, quantidade: Number(inputComida.qtd) }])
    setInputComida({ nome: "", qtd: "" })
  }

  const adicionarBebida = () => {
    if (!inputBebida.nome || !inputBebida.qtd || Number(inputBebida.qtd) <= 0) return
    setBebidasGuardadas([...bebidasGuardadas, { id: Date.now(), nome: inputBebida.nome, quantidade: Number(inputBebida.qtd) }])
    setInputBebida({ nome: "", qtd: "" })
  }

  async function enviarAoBanco() {
    setLoading(true)
    const dadosFinais = { comidas: comidasGuardadas, bebidas: bebidasGuardadas }
    console.log("Enviando ao banco de dados:", dadosFinais)
    
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setComidasGuardadas([])
      setBebidasGuardadas([])
      setTimeout(() => setSuccess(false), 3000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative font-sans antialiased">
      <Header />
      
      <main className="p-4 pb-32 space-y-6">
        <header className="mt-2">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Registrar Consumo</h1>
          <p className="text-sm text-muted-foreground font-medium">Adicione itens às listas e salve ao final.</p>
        </header>

        {success ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300 shadow-sm">
            <div className="w-16 h-16 bg-[#e2fcfc] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#1ab394]" />
            </div>
            <h3 className="text-[#1ab394] text-lg font-bold">Sucesso!</h3>
            <p className="text-emerald-700 text-sm">Todos os itens foram enviados ao banco.</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* SEÇÃO DE COMIDAS (SÓLIDOS) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                  <Utensils className="w-3 h-3" /> Comidas
                </h2>
                {comidasGuardadas.length > 0 && (
                  <button onClick={() => setShowComidas(!showComidas)} className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                    {comidasGuardadas.length} item(s) {showComidas ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}
              </div>

              {/* Expansivo de Comidas Guardadas */}
              {showComidas && comidasGuardadas.length > 0 && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  {comidasGuardadas.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-card/50 border border-border/40 rounded-xl text-xs">
                      <span className="font-medium text-foreground">{item.nome} ({item.quantidade}g)</span>
                      <button onClick={() => setComidasGuardadas(comidasGuardadas.filter(i => i.id !== item.id))}>
                        <Trash2 className="w-3 h-3 text-destructive/60 hover:text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input de Comida */}
              <div className="bg-card p-4 rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-border/50 space-y-3">
                <div className="relative">
                  <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    value={inputComida.nome}
                    onChange={(e) => setInputComida({...inputComida, nome: e.target.value})}
                    placeholder="O que comeu?"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/30 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="number"
                      min="0"
                      value={inputComida.qtd}
                      onChange={(e) => setInputComida({...inputComida, qtd: e.target.value})}
                      placeholder="Grams (g)"
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/30 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <button onClick={adicionarComida} className="bg-primary text-primary-foreground px-4 rounded-xl font-bold hover:brightness-110 transition-all">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </section>

            {/* SEÇÃO DE BEBIDAS (LÍQUIDOS) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-bold text-[#5b8def] uppercase tracking-widest flex items-center gap-2">
                  <Droplets className="w-3 h-3" /> Bebidas
                </h2>
                {bebidasGuardadas.length > 0 && (
                  <button onClick={() => setShowBebidas(!showBebidas)} className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                    {bebidasGuardadas.length} item(s) {showBebidas ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}
              </div>

              {/* Expansivo de Bebidas Guardadas */}
              {showBebidas && bebidasGuardadas.length > 0 && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  {bebidasGuardadas.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-card/50 border border-border/40 rounded-xl text-xs">
                      <span className="font-medium text-foreground">{item.nome} ({item.quantidade}ml)</span>
                      <button onClick={() => setBebidasGuardadas(bebidasGuardadas.filter(i => i.id !== item.id))}>
                        <Trash2 className="w-3 h-3 text-destructive/60 hover:text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input de Bebida */}
              <div className="bg-card p-4 rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-border/50 space-y-3">
                <div className="relative">
                  <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    value={inputBebida.nome}
                    onChange={(e) => setInputBebida({...inputBebida, nome: e.target.value})}
                    placeholder="O que bebeu?"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/30 border border-border text-sm outline-none focus:ring-2 focus:ring-[#5b8def]/20"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">ML</div>
                    <input 
                      type="number"
                      min="0"
                      value={inputBebida.qtd}
                      onChange={(e) => setInputBebida({...inputBebida, qtd: e.target.value})}
                      placeholder="Volume"
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/30 border border-border text-sm outline-none focus:ring-2 focus:ring-[#5b8def]/20"
                    />
                  </div>
                  <button onClick={adicionarBebida} className="bg-[#5b8def] text-white px-4 rounded-xl font-bold hover:brightness-110 transition-all">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </section>

            {/* BOTÃO FINAL DE ENVIO */}
            {(comidasGuardadas.length > 0 || bebidasGuardadas.length > 0) && (
              <button 
                onClick={enviarAoBanco}
                disabled={loading}
                className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/30 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {loading ? "Sincronizando..." : "Finalizar e Salvar no Banco"}
              </button>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}