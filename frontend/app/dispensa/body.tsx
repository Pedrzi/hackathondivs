"use client"

import { useState, useEffect, useRef } from "react"
import { BrowserMultiFormatReader } from "@zxing/browser" 
import { Header } from "@/components/nutrition/header"
import { BottomNav } from "@/components/nutrition/bottom-nav"
import { 
  Package, 
  Search, 
  Plus, 
  Minus, 
  ChevronRight, 
  AlertTriangle, 
  Loader2, 
  User, 
  Home, 
  Activity, 
  X,
  Camera // Garantindo que Camera está importado
} from "lucide-react"


// CONFIGURAÇÃO DO ENDPOINT
const API_URL = ""
function BarcodeScanner({ onResult, onClose }: { onResult: (code: string) => void, onClose: () => void }) {
  // Usamos useRef para acessar o elemento de vídeo diretamente
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    if (!videoRef.current) return

    const codeReader = new BrowserMultiFormatReader()
    
    // Inicia a leitura da câmera
    codeReader.decodeFromVideoDevice(
      undefined, // undefined usa a câmera padrão
      videoRef.current,
      (result, error, controls) => {
        if (result) {
          onResult(result.getText())
          controls.stop() // Para o scan após o primeiro sucesso
        }
      }
    ).then((controls) => {
      controlsRef.current = controls
    }).catch((err) => {
      console.error("Erro ao iniciar câmera:", err)
    })

    // Cleanup: Para a câmera quando o componente desmontar
    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop()
      }
    }
  }, [onResult])

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center animate-in fade-in duration-200">
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 text-white bg-white/20 p-3 rounded-full backdrop-blur-md hover:bg-white/30 transition-all z-50"
      >
        <X className="w-6 h-6" />
      </button>
      
      <div className="relative w-full max-w-md aspect-[3/4] bg-black overflow-hidden rounded-3xl border border-white/10 shadow-2xl mx-4">
        {/* Elemento de vídeo onde o stream da câmera será renderizado */}
        <video ref={videoRef} className="w-full h-full object-cover" />
        
        {/* Overlay visual de scan (Mira) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-72 h-48 border-2 border-primary/80 rounded-2xl relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary -mt-1 -ml-1 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary -mt-1 -mr-1 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary -mb-1 -ml-1 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary -mb-1 -mr-1 rounded-br-lg"></div>
            
            {/* Linha de scan animada */}
            <div className="w-full h-0.5 bg-red-500/80 absolute top-1/2 -translate-y-1/2 animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-white/90 font-medium bg-black/50 inline-block px-4 py-2 rounded-full backdrop-blur-sm text-sm">
                Aponte para o código de barras
            </p>
        </div>
      </div>
    </div>
  )
}

// --- Tipos ---

interface Produto {
  id_codigo_barras: string
  nome: string
  marca: string
  quantidade_embalagem_g: number
  imagem?: string // URL da imagem vinda do DB
  info_nutricional: {
    calorias: number
  }
}

interface ItemDispensa {
  produto: Produto
  quantidade_unidades: number
}

// --- Componente Principal ---

export default function BodyDispensa() {
  const [items, setItems] = useState<ItemDispensa[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  
  // Estados para o Scanner
  const [showScanner, setShowScanner] = useState(false)
  const [processingScan, setProcessingScan] = useState(false)

  // 1. Carregar dados iniciais
  useEffect(() => {
    fetchDispensa()
  }, [])

  const fetchDispensa = async () => {
    try {
      const res = await fetch(`${API_URL}/api/dispensa/`)
      if (!res.ok) throw new Error("Falha ao conectar com o servidor")
      const data = await res.json()
      setItems(data)
    } catch (err) {
      console.error(err)
      setError("Erro ao carregar dispensa.")
    } finally {
      setLoading(false)
    }
  }

  // 2. Atualizar Quantidade (+1 ou -1)
  const handleUpdateQuantity = async (barcode: string, delta: number) => {
    try {
      // Otimização Otimista: Atualiza a UI imediatamente antes do servidor responder
      const newItems = items.map(item => {
        if (item.produto.id_codigo_barras === barcode) {
          const newQtd = Math.max(0, item.quantidade_unidades + delta)
          return { ...item, quantidade_unidades: newQtd }
        }
        return item
      }).filter(item => item.quantidade_unidades > 0) // Remove visualmente se for 0
      
      setItems(newItems)

      // Chama o backend
      // NOTA: O backend deve suportar query params: ?quantidade=1 ou ?quantidade=-1
      const res = await fetch(`${API_URL}/api/dispensa/adicionar/${barcode}?quantidade=${delta}`, {
        method: "POST"
      })
      
      if (!res.ok) throw new Error("Erro na API")
      
      // Sincroniza estado real após sucesso (opcional, mas seguro)
      fetchDispensa()

    } catch (err) {
      alert("Erro ao atualizar estoque. Revertendo...")
      fetchDispensa()
    }
  }

  // 3. Processar resultado do Scanner
  const handleScanResult = async (barcode: string) => {
    // Evita leituras duplicadas muito rápidas
    if (processingScan) return
    setProcessingScan(true)
    
    // Feedback tátil/sonoro seria ideal aqui
    setShowScanner(false) // Fecha a câmera

    try {
        // Adiciona 1 unidade do produto escaneado
      const res = await fetch(`${API_URL}/api/dispensa/adicionar/${barcode}?quantidade=1`, {
        method: "POST"
      })
      
    } catch (err) {
      alert("Erro de conexão ao processar escaneamento.")
    } finally {
      setProcessingScan(false)
    }
  }

  // Filtro de busca local
  const filteredItems = items.filter(item => 
    item.produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.produto.marca.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative font-sans antialiased pb-24">
      <Header />

      {/* --- MODAL DO SCANNER --- */}
      {showScanner && (
        <BarcodeScanner 
          onResult={handleScanResult} 
          onClose={() => setShowScanner(false)} 
        />
      )}

      <main className="pt-4 px-4 space-y-6">
        <header className="flex flex-col gap-1 mt-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Minha Dispensa</h1>
          <p className="text-sm text-muted-foreground font-medium">Controle de estoque e mantimentos</p>
        </header>

        {/* Barra de Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome ou marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Lista de Itens */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
              Itens ({filteredItems.length})
            </h2>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
          </div>
          
          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm flex items-center gap-2 border border-red-200">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          {!loading && filteredItems.length === 0 && !error && (
            <div className="text-center py-12 flex flex-col items-center gap-3 text-muted-foreground">
              <div className="bg-secondary p-4 rounded-full">
                <Package className="w-8 h-8 opacity-40" />
              </div>
              <p className="text-sm font-medium">Sua dispensa está vazia</p>
              <button onClick={() => setShowScanner(true)} className="text-primary text-xs font-bold hover:underline">
                Escaneie seu primeiro item
              </button>
            </div>
          )}

          {/* Cards de Produtos */}
          {filteredItems.map((item, index) => (
            <div 
              key={`${item.produto.id_codigo_barras}-${index}`}
              className="bg-card rounded-2xl p-3 shadow-sm border border-border/50 flex items-center justify-between group transition-all hover:border-primary/30"
            >
              <div className="flex items-center gap-3 overflow-hidden flex-1">
                {/* Imagem do Produto */}
                <div className="w-12 h-12 rounded-xl bg-secondary/30 flex items-center justify-center shrink-0 overflow-hidden relative border border-border">
                  {item.produto.imagem ? (
                    <img 
                      src={item.produto.imagem} 
                      alt={item.produto.nome}
                      className="w-full h-full object-cover"
                      // Fallback se a imagem quebrar
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  {/* Ícone Fallback */}
                  <Package className={`w-5 h-5 text-muted-foreground/50 ${item.produto.imagem ? 'hidden' : ''}`} />
                </div>
                
                <div className="min-w-0 flex-1 pr-2">
                  <h3 className="text-sm font-bold text-foreground truncate leading-tight">{item.produto.nome}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider truncate mt-0.5">
                    {item.produto.marca}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                     <span>{item.produto.quantidade_embalagem_g}g</span>
                     <span className="w-1 h-1 rounded-full bg-muted-foreground/40"></span>
                     <span>{item.produto.info_nutricional.calorias}kcal</span>
                  </p>
                </div>
              </div>

              {/* Controles de Quantidade */}
              <div className="flex items-center gap-1 bg-secondary/30 p-1 rounded-xl border border-border/50">
                <button 
                  onClick={() => handleUpdateQuantity(item.produto.id_codigo_barras, -1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-background shadow-sm text-foreground hover:text-red-600 hover:bg-red-50 active:scale-95 transition-all"
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                
                <span className="w-7 text-center text-xs font-bold font-mono">
                  {item.quantidade_unidades}
                </span>

                <button 
                  onClick={() => handleUpdateQuantity(item.produto.id_codigo_barras, 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-background shadow-sm text-foreground hover:text-green-600 hover:bg-green-50 active:scale-95 transition-all"
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Botões de Ação */}
        <div className="grid grid-cols-2 gap-3 pt-2">
            <button 
                onClick={() => {
                    const manualCode = prompt("Digite o código manualmente:");
                    if(manualCode) handleUpdateQuantity(manualCode, 1);
                }}
                className="h-12 rounded-xl bg-secondary text-secondary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-secondary/80 transition-all active:scale-[0.98]"
            >
                <Search className="w-4 h-4" />
                Digitar Código
            </button>

            <button 
                onClick={() => setShowScanner(true)}
                className="h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
            >
                <Camera className="w-4 h-4" />
                Ler Código
            </button>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}