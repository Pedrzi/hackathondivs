'use client'

import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/nutrition/header"
import { 
  Calendar, Users, ChevronDown, ChevronUp, Clock, 
  UserCircle, ExternalLink, Search, CheckCircle2, Plus, 
  Utensils, BookOpen, FolderPlus, ChevronRight, FileText, Upload, Home,
  Loader2, AlertTriangle
} from "lucide-react"
import Link from "next/link"

const NUTRI_ID = "928f6268-0adf-40e4-bc63-caca92e5f708"

// Interface updated to match Backend
interface PacienteDB {
  id: string
  name: string
  age: number
  height: number
  weight: number
  attention_score: number
}

const initialPlanos = [
  { id: 1, tipo: "Hypertrophy", total: 5, fileName: "hypertrophy_guide.pdf" },
  { id: 2, tipo: "Vegan", total: 3, fileName: null },
  { id: 3, tipo: "Low Carb", total: 8, fileName: null },
]

export default function BodyNutricionista() {
  const [expandConsultas, setExpandConsultas] = useState(true)
  const [expandPacientes, setExpandPacientes] = useState(true)
  const [expandPlanos, setExpandPlanos] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  
  const [pacientes, setPacientes] = useState<PacienteDB[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [planos, setPlanos] = useState(initialPlanos)
  const [novoTipoDieta, setNovoTipoDieta] = useState("")
  const [showAddDieta, setShowAddDieta] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activePlanoId, setActivePlanoId] = useState<number | null>(null)

  useEffect(() => {
    fetchPacientes()
  }, [])

  const fetchPacientes = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/nutricionista/${NUTRI_ID}/pacientes`)
      if (!res.ok) throw new Error("Error fetching patients")
      const data = await res.json()
      setPacientes(data)
    } catch (err) {
      console.error(err)
      setError("Could not load patient list.")
    } finally {
      setLoading(false)
    }
  }

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

  const getStatusColor = (score: number) => {
    if (score <= 3) return "bg-red-500"
    if (score <= 7) return "bg-orange-500"
    return "bg-green-500"
  }

  const filteredPacientes = pacientes.filter(p => 
    (p.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
    (p.age.toString() + " years").includes(searchTerm)
  )

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
        <header className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Professional Dashboard</h1>
            <p className="text-sm text-muted-foreground font-medium">Schedule and patient management</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Link 
              href="/" 
              className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center border border-border hover:bg-muted/80 transition-colors"
              title="Back to Home"
            >
              <Home className="w-6 h-6 text-muted-foreground" />
            </Link>

            <Link 
              href="/nutricionista/perfil"
              className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 hover:bg-primary/20 transition-colors"
              title="My Professional Profile"
            >
              <UserCircle className="w-7 h-7 text-primary" />
            </Link>
          </div>
        </header>

        <section className="space-y-3">
          <button 
            onClick={() => setExpandConsultas(!expandConsultas)}
            className="w-full flex items-center justify-between p-4 bg-card rounded-2xl border border-border/50 shadow-sm transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 font-bold text-sm text-foreground uppercase tracking-widest">
              <Calendar className="w-4 h-4 text-[#5b8def]" />
              Appointments
            </div>
            {expandConsultas ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>

          {expandConsultas && (
            <div className="space-y-4 pl-2 animate-in slide-in-from-top-2 duration-300">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-primary/30 text-primary hover:bg-primary/5 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-tight">Schedule new appointment</span>
              </button>

              <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase ml-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-primary" /> Scheduled
                </h3>
                <div className="bg-card p-4 rounded-xl border border-border/40 shadow-sm flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold">Example Patient</p>
                    <p className="text-[10px] text-muted-foreground">Today, at 2:30 PM</p>
                  </div>
                  <button className="text-xs font-bold text-[#5b8def] px-3 py-1 bg-[#e5f1ff] rounded-lg hover:brightness-95 transition-all">
                    Start
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-3">
          <button 
            onClick={() => setExpandPacientes(!expandPacientes)}
            className="w-full flex items-center justify-between p-4 bg-card rounded-2xl border border-border/50 shadow-sm transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 font-bold text-sm text-foreground uppercase tracking-widest">
              <Users className="w-4 h-4 text-primary" />
              Patient List
            </div>
            {expandPacientes ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>

          {expandPacientes && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted/30 border border-border text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {loading && (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                {!loading && filteredPacientes.length === 0 && (
                  <p className="text-center text-xs text-muted-foreground py-4">No patients found.</p>
                )}

                {filteredPacientes.map((paciente) => (
                  <div key={paciente.id} className="bg-card p-4 rounded-xl border border-border/40 shadow-sm flex justify-between items-center group hover:border-primary transition-all">
                    <div>
                      {/* USANDO O CAMPO NAME */}
                      <p className="text-sm font-bold text-foreground capitalize">
                        {paciente.name || `Patient ${paciente.id.substring(0,6)}`}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">
                        {paciente.age} years • {paciente.weight}kg
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end mr-1">
                        <span className="text-[9px] text-muted-foreground font-semibold uppercase">Adherence</span>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white shadow-sm ${getStatusColor(paciente.attention_score)}`}>
                          {paciente.attention_score}
                        </div>
                      </div>

                      <Link 
                        href={`/nutricionista/${paciente.id}`} 
                        className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="space-y-3">
          <button 
            onClick={() => setExpandPlanos(!expandPlanos)}
            className="w-full flex items-center justify-between p-4 bg-card rounded-2xl border border-border/50 shadow-sm transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 font-bold text-sm text-foreground uppercase tracking-widest">
              <BookOpen className="w-4 h-4 text-orange-500" />
              Meal Plan Templates
            </div>
            {expandPlanos ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>

          {expandPlanos && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              {showAddDieta ? (
                <div className="flex gap-2 animate-in fade-in duration-200">
                  <input 
                    type="text"
                    placeholder="Template diet name..."
                    value={novoTipoDieta}
                    onChange={(e) => setNovoTipoDieta(e.target.value)}
                    className="flex-1 h-10 px-4 rounded-xl bg-muted/30 border border-border text-xs outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                  <button 
                    onClick={adicionarTipoDieta}
                    className="px-4 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAddDieta(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-orange-500/30 text-orange-500 hover:bg-orange-500/5 transition-colors text-xs font-bold uppercase tracking-tight"
                >
                  <FolderPlus className="w-4 h-4" />
                  New Diet Type
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
                          <p className="text-[10px] text-muted-foreground font-medium">{plano.total} saved templates</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => triggerUpload(plano.id)}
                        className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-orange-500/10 hover:text-orange-500 transition-colors"
                        title="Upload file"
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