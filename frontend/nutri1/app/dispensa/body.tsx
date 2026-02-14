"use client"

import { useState } from "react"
import { Header } from "@/components/nutrition/header"
import { BottomNav } from "@/components/nutrition/bottom-nav"
import { 
  Package, 
  Search, 
  Plus, 
  ChevronRight, 
  Trash2, 
  Save, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Scale,
  Hash
} from "lucide-react"

interface ItemDispensa {
  id: number;
  nome: string;
  quantidade: number;
  unidade: 'kg' | 'g' | 'un';
}

export default function BodyDispensa() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [itensNovos, setItensNovos] = useState<ItemDispensa[]>([])
  const [showAddList, setShowAddList] = useState(false)

  // Estados para o formulário atual
  const [formData, setFormData] = useState({
    nome: "",
    quantidade: "",
    unidade: "kg" as 'kg' | 'g' | 'un'
  })

  const adicionarAListaTemporaria = () => {
    if (!formData.nome || !formData.quantidade || Number(formData.quantidade) <= 0) return

    const novoItem: ItemDispensa = {
      id: Date.now(),
      nome: formData.nome,
      quantidade: Number(formData.quantidade),
      unidade: formData.unidade
    }

    setItensNovos([...itensNovos, novoItem])
    setFormData({ nome: "", quantidade: "", unidade: "kg" })
    setShowAddList(true)
  }

  async function salvarNoBanco() {
    setLoading(true)
    // Aqui você integraria com seu banco de dados (ex: Supabase, API Route)
    console.log("Salvando estoque no banco de dados:", itensNovos)
    
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setItensNovos([])
      setTimeout(() => setSuccess(false), 3000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative font-sans antialiased">
      <Header />

      <main className="pb-32 pt-4 px-4 space-y-6">
        <header className="mt-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Minha Despensa</h1>
          <p className="text-sm text-muted-foreground font-medium">Gerencie seu estoque de mantimentos.</p>
        </header>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar na dispensa..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary/30 outline-none transition-all"
          />
        </div>

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in zoom-in">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <p className="text-sm font-bold text-primary">Estoque atualizado com sucesso!</p>
          </div>
        )}

        {/* FORMULÁRIO DE ADIÇÃO */}
        <section className="space-y-4">
          <div className="bg-card p-5 rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-border/50 space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Nome do produto (ex: Feijão)"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/30 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="number"
                    min="0"
                    value={formData.quantidade}
                    onChange={(e) => setFormData({...formData, quantidade: e.target.value})}
                    placeholder="Qtd"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/30 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <select 
                  value={formData.unidade}
                  onChange={(e) => setFormData({...formData, unidade: e.target.value as any})}
                  className="bg-muted/30 border border-border rounded-xl px-3 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="un">un</option>
                </select>
                <button 
                  onClick={adicionarAListaTemporaria}
                  className="bg-primary text-primary-foreground px-4 rounded-xl font-bold hover:brightness-105 active:scale-95 transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* LISTA EXPANSIVA DE ITENS NOVOS */}
          {itensNovos.length > 0 && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
              <button 
                onClick={() => setShowAddList(!showAddList)}
                className="flex items-center justify-between w-full px-1"
              >
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Novos itens ({itensNovos.length})
                </h2>
                {showAddList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAddList && (
                <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/50 shadow-sm overflow-hidden">
                  {itensNovos.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 hover:bg-muted/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Hash className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{item.nome}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                            Total: {item.quantidade}{item.unidade}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setItensNovos(itensNovos.filter(i => i.id !== item.id))}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    onClick={salvarNoBanco}
                    disabled={loading}
                    className="w-full py-4 bg-primary/5 text-primary text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Sincronizando..." : "Confirmar e Salvar"}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* LISTA ATUAL DO ESTOQUE (Visualização do Banco) */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Estoque Atual</h2>
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
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg tracking-tighter">ESTOQUE OK</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
