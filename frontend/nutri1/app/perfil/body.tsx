"use client"

import { useState, useRef } from "react"
import { Header } from "@/components/nutrition/header"
import { BottomNav } from "@/components/nutrition/bottom-nav"
import { 
  User, 
  Calendar, 
  Camera, 
  AlertTriangle, 
  Leaf, 
  Dumbbell, 
  Candy, 
  Save,
  Clock,
  CheckCircle2
} from "lucide-react"

export default function BodyPerfil() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Estados para as novas preferências
  const [paladar, setPaladar] = useState<"doce" | "salgado" | "neutro">("neutro")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setProfileImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      ...Object.fromEntries(formData),
      paladar,
      foto: profileImage
    }

    // Simulação de salvamento no banco de dados
    console.log("Salvando dados no banco:", data)
    
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative font-sans antialiased">
      <Header />
      
      <main className="p-4 pb-32 space-y-6">
        <header className="mt-2 text-center">
          <div className="relative w-24 h-24 mx-auto mb-3">
            <div className="w-full h-full rounded-full bg-muted border-2 border-primary/20 flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
              accept="image/*" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-primary p-2 rounded-full shadow-lg border-2 border-white hover:scale-110 transition-transform"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Meu Perfil</h1>
          <p className="text-xs text-muted-foreground">Personalize sua experiência Nutri.</p>
        </header>

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in zoom-in">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <p className="text-sm font-bold text-primary">Perfil atualizado com sucesso!</p>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Dados Pessoais */}
          <section className="bg-card p-5 rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-border/50 space-y-4">
            <h2 className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Dados Pessoais</h2>
            
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input name="nome" type="text" placeholder="Nome Completo" required className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/30 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input name="idade" type="number" min="0" placeholder="Idade" required className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/30 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="relative">
                <select name="sexo" required className="w-full h-11 px-4 rounded-xl bg-muted/30 border border-border text-sm outline-none appearance-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Sexo</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>
            </div>
          </section>

          {/* Estilo de Vida */}
          <section className="bg-card p-5 rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-border/50 space-y-4">
            <h2 className="text-[10px] font-bold text-[#5b8def] uppercase tracking-widest ml-1">Estilo de Vida</h2>
            
            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl border border-border/40">
              <Dumbbell className="w-4 h-4 text-[#5b8def]" />
              <div className="flex-1 flex justify-between items-center">
                <span className="text-sm font-medium">Treino semanal</span>
                <select name="horasTreino" className="bg-transparent text-sm font-bold text-[#5b8def] outline-none">
                  <option value="0">0h / semana</option>
                  <option value="1-3">1h - 3h</option>
                  <option value="3-5">3h - 5h</option>
                  <option value="5+">Mais de 5h</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl border border-border/40">
              <Candy className="w-4 h-4 text-pink-500" />
              <div className="flex-1 space-y-2">
                <span className="text-sm font-medium">Preferência de paladar:</span>
                <div className="flex gap-2">
                  {["doce", "neutro", "salgado"].map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setPaladar(pref as any)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all ${
                        paladar === pref 
                        ? "bg-primary text-white border-primary shadow-sm" 
                        : "bg-white text-muted-foreground border-border"
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Dieta e Saúde */}
          <section className="bg-card p-5 rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-border/50 space-y-4">
            <h2 className="text-[10px] font-bold text-[#e8a838] uppercase tracking-widest ml-1">Nutrição</h2>
            
            <div className="relative">
              <AlertTriangle className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <textarea name="alergenos" placeholder="Alérgenos ou restrições..." className="w-full min-h-20 pl-10 pr-4 pt-2 rounded-xl bg-muted/30 border border-border text-sm outline-none focus:ring-2 focus:ring-[#e8a838]/20" />
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl border border-border/40">
              <Leaf className="w-4 h-4 text-[#1ab394]" />
              <select name="tipoDieta" className="flex-1 bg-transparent text-sm font-medium outline-none">
                <option value="padrao">Dieta Padrão</option>
                <option value="vegetariana">Vegetariana</option>
                <option value="vegana">Vegana</option>
              </select>
            </div>
          </section>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/30 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? "Sincronizando..." : "Salvar"}
          </button>
        </form>
      </main>

      <BottomNav />
    </div>
  )
}