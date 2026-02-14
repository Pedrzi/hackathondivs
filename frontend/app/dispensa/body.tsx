"use client"

import { useState, useEffect } from "react"
// Imports originais mantidos conforme solicitado (não funcionarão no preview aqui, mas funcionarão no seu projeto)
import { Header } from "@/components/nutrition/header"
import { BottomNav } from "@/components/nutrition/bottom-nav"
import { Package, Search, Plus, ChevronRight, AlertTriangle, Loader2 } from "lucide-react"

// CONFIGURAÇÃO DO ENDPOINT
const API_URL = "http://localhost:8000"

interface Produto {
  id_codigo_barras: string
  nome: string
  marca: string
  quantidade_embalagem_g: number
  imagem?: string // Campo de imagem vindo do Banco de Dados
  info_nutricional: {
    calorias: number
  }
}

interface ItemDispensa {
  produto: Produto
  quantidade_unidades: number
}

export default function BodyDispensa() {
  const [items, setItems] = useState<ItemDispensa[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchDispensa()
  }, [])

  const fetchDispensa = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/api/dispensa/`)
      if (!res.ok) throw new Error("Falha ao conectar com o servidor")
      const data = await res.json()
      setItems(data)
    } catch (err) {
      console.error(err)
      setError("Erro ao carregar dispensa. O backend está rodando?")
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async () => {
    const barcode = prompt("Digite o código de barras para testar (ex: 3017620422003 da Nutella):")
    if (!barcode) return

    try {
      const res = await fetch(`${API_URL}/api/dispensa/adicionar/${barcode}`, {
        method: "POST"
      })
      
      if (res.ok) {
        alert("Produto adicionado!")
        fetchDispensa()
      } else {
        alert("Erro ao adicionar. O produto existe no banco?")
      }
    } catch (err) {
      alert("Erro de conexão")
    }
  }

  const filteredItems = items.filter(item => 
    item.produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.produto.marca.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative font-sans antialiased pb-24">
      <Header />

      <main className="pt-4 px-4 space-y-6">
        <header className="flex flex-col gap-1 mt-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Minha Dispensa</h1>
          <p className="text-sm text-muted-foreground font-medium">Controle de estoque e mantimentos</p>
        </header>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar na dispensa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
              Itens ({filteredItems.length})
            </h2>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
          </div>
          
          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          {!loading && filteredItems.length === 0 && !error && (
            <div className="text-center py-10 text-muted-foreground text-sm">
              Nenhum item encontrado. Adicione algo!
            </div>
          )}

          {filteredItems.map((item, index) => (
            <div 
              key={`${item.produto.id_codigo_barras}-${index}`}
              className="bg-card rounded-2xl p-4 shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-border/50 flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Lógica de Imagem com Fallback */}
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden relative">
                  {item.produto.imagem ? (
                    <img 
                      src={item.produto.imagem} 
                      alt={item.produto.nome}
                      className="w-full h-full object-cover"
                      // Adiciona um manipulador de erro caso a URL da imagem esteja quebrada
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  {/* Fallback Icon: Mostra se não houver imagem OU se a imagem falhar ao carregar */}
                  <Package 
                    className={`w-5 h-5 text-primary ${item.produto.imagem ? 'hidden' : ''}`} 
                  />
                </div>
                
                <div>
                  <h3 className="text-sm font-bold text-foreground">{item.produto.nome}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    {item.produto.marca} • {item.produto.quantidade_embalagem_g}g
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`text-[10px] font-bold px-2 py-1 rounded-lg ${item.quantidade_unidades < 2 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                  {item.quantidade_unidades} UNID
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={handleAddItem}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Novo Alimento (Simular Scan)
        </button>
      </main>

      <BottomNav />
    </div>
  )
}