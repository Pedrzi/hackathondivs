"use client"

import { useState, useRef } from "react"
import { Header } from "@/components/nutrition/header"
import { 
  Calendar, Users, ChevronDown, ChevronUp, Clock, 
  UserCircle, ExternalLink, Search, CheckCircle2, Plus, 
  Utensils, BookOpen, FolderPlus, ChevronRight, FileText, Upload, Home
} from "lucide-react"
import Link from "next/link"

const pacientesMock = [
  { id: 1, nome: "João Silva", objetivo: "Perda de Peso" },
  { id: 2, nome: "Maria Santos", objetivo: "Hipertrofia" },
  { id: 3, nome: "Pedro Costa", objetivo: "Saúde" },
]

const initialPlanos = [
  { id: 1, tipo: "Hipertrofia", total: 5, fileName: "guia_hipertrofia.pdf" },
  { id: 2, tipo: "Vegana", total: 3, fileName: null },
  { id: 3, tipo: "Low Carb", total: 8, fileName: null },
]

export default function BodyNutricionista() {
  const [expandConsultas, setExpandConsultas] = useState(true)
  const [expandPacientes, setExpandPacientes] = useState(false)
  const [expandPlanos, setExpandPlanos] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  
  const [planos, setPlanos] = useState(initialPlanos)
  const [novoTipoDieta, setNovoTipoDieta] = useState("")
  const [showAddDieta, setShowAddDieta] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activePlanoId, setActivePlanoId] = useState<number | null>(null)

  const adicionarTipoDieta = () => {
    if (novoTipoDieta.trim() !== "") {
      setPlanos([...planos, { id: Date.now(), tipo: novoTipoDieta, total: 0, fileName: null }])
      setNovoTipoDieta("")
      setShowAddDieta(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && activePlanoId !== null) {
      setPlanos(planos.map(p => 
        p.id === activePlanoId ? { ...p, fileName: file.name } : p
      ))
      setActivePlanoId(null)
    }
  }

  const triggerUpload = (id: number) => {
    setActivePlanoId(id)
    fileInputRef.current?.click()
  }

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative font-sans antialiased">
      <Header />
      
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileUpload}
      />

      <main className="p-4 pb-12 space-y-6">
        {/* HEADER DO PAINEL COM ÍCONES DE NAVEGAÇÃO */}
        <header className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Painel Profissional</h1>
            <p className="text-sm text-muted-foreground font-medium">Gestão de agenda e pacientes</p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Ícone de Casinha: Retorna à página principal do app */}
            <Link 
              href="/" 
              className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center border border-border hover:bg-muted/80 transition-colors"
              title="Voltar à Home"
            >
              <Home className="w-6 h-6 text-muted-foreground" />
            </Link>

            {/* Ícone de Perfil: Leva ao Perfil Profissional da Nutricionista */}
            <Link 
              href="/nutricionista/perfil"
              className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 hover:bg-primary/20 transition-colors"
              title="Meu Perfil Profissional"
            >
              <UserCircle className="w-7 h-7 text-primary" />
            </Link>
          </div>
        </header>

        {/* SEÇÃO DE CONSULTAS */}
        <section className="space-y-3">
          <button 
            onClick={() => setExpandConsultas(!expandConsultas)}
            className="w-full flex items-center justify-between p-4 bg-card rounded-2xl border border-border/50 shadow-sm transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 font-bold text-sm text-foreground uppercase tracking-widest">
              <Calendar className="w-4 h-4 text-[#5b8def]" />
              Consultas
            </div>
            {expandConsultas ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>

          {expandConsultas && (
            <div className="space-y-4 pl-2 animate-in slide-in-from-top-2 duration-300">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-primary/30 text-primary hover:bg-primary/5 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-tight">Agendar nova consulta</span>
              </button>

              <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase ml-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-primary" /> Já Agendadas
                </h3>
                <div className="bg-card p-4 rounded-xl border border-border/40 shadow-sm flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold">Maria Santos</p>
                    <p className="text-[10px] text-muted-foreground">Hoje, às 14:30h</p>
                  </div>
                  <button className="text-xs font-bold text-[#5b8def] px-3 py-1 bg-[#e5f1ff] rounded-lg hover:brightness-95 transition-all">
                    Iniciar
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase ml-2 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-orange-400" /> Por Agendar
                </h3>
                <div className="p-4 rounded-xl border border-border/40 shadow-sm flex justify-between items-center bg-orange-50/30">
                  <div>
                    <p className="text-sm font-bold text-foreground">João Silva</p>
                    <p className="text-[10px] text-orange-600 font-medium">Solicitou há 2 horas</p>
                  </div>
                  <button className="text-[10px] font-bold text-white px-3 py-1.5 bg-orange-400 rounded-lg shadow-sm hover:bg-orange-500 transition-colors">
                    Marcar Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SEÇÃO DE PACIENTES */}
        <section className="space-y-3">
          <button 
            onClick={() => setExpandPacientes(!expandPacientes)}
            className="w-full flex items-center justify-between p-4 bg-card rounded-2xl border border-border/50 shadow-sm transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 font-bold text-sm text-foreground uppercase tracking-widest">
              <Users className="w-4 h-4 text-primary" />
              Lista de Pacientes
            </div>
            {expandPacientes ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>

          {expandPacientes && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Buscar paciente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted/30 border border-border text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                {pacientesMock.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase())).map((paciente) => (
                  <div key={paciente.id} className="bg-card p-4 rounded-xl border border-border/40 shadow-sm flex justify-between items-center group hover:border-primary transition-all">
                    <div>
                      <p className="text-sm font-bold text-foreground">{paciente.nome}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Objetivo: {paciente.objetivo}</p>
                    </div>
                    <Link 
                      href={`/nutricionista/${paciente.id}`} 
                      className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* SEÇÃO DE PLANOS ALIMENTARES */}
        <section className="space-y-3">
          <button 
            onClick={() => setExpandPlanos(!expandPlanos)}
            className="w-full flex items-center justify-between p-4 bg-card rounded-2xl border border-border/50 shadow-sm transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 font-bold text-sm text-foreground uppercase tracking-widest">
              <BookOpen className="w-4 h-4 text-orange-500" />
              Planos Alimentares Modelos
            </div>
            {expandPlanos ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>

          {expandPlanos && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              {showAddDieta ? (
                <div className="flex gap-2 animate-in fade-in duration-200">
                  <input 
                    type="text"
                    placeholder="Nome da dieta modelo..."
                    value={novoTipoDieta}
                    onChange={(e) => setNovoTipoDieta(e.target.value)}
                    className="flex-1 h-10 px-4 rounded-xl bg-muted/30 border border-border text-xs outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                  <button 
                    onClick={adicionarTipoDieta}
                    className="px-4 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm"
                  >
                    Salvar
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAddDieta(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-orange-500/30 text-orange-500 hover:bg-orange-500/5 transition-colors text-xs font-bold uppercase tracking-tight"
                >
                  <FolderPlus className="w-4 h-4" />
                  Novo Tipo de Dieta
                </button>
              )}

              <div className="grid grid-cols-1 gap-2">
                {planos.map((plano) => (
                  <div key={plano.id} className="bg-card p-4 rounded-xl border border-border/40 shadow-sm space-y-3 group hover:border-orange-500/50 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                          <Utensils className="w-4 h-4 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{plano.tipo}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">{plano.total} modelos salvos</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => triggerUpload(plano.id)}
                        className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-orange-500/10 hover:text-orange-500 transition-colors"
                        title="Upload de arquivo"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>

                    {plano.fileName && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-lg animate-in fade-in slide-in-from-left-2">
                        <FileText className="w-3 h-3 text-orange-600" />
                        <span className="text-[10px] font-bold text-orange-700 truncate max-w-45">
                          {plano.fileName}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}