"use client"

import { useState, useRef } from "react"
import { Header } from "@/components/nutrition/header"
import { BottomNav } from "@/components/nutrition/bottom-nav"
import { 
  User, Camera, Save, ArrowLeft, Briefcase, 
  GraduationCap, Award, MapPin, CheckCircle2, Phone 
} from "lucide-react"
import Link from "next/link"

export default function BodyPerfilProfissional() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setProfileImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Simulação de salvamento no banco
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
        <Link 
          href="/nutricionista" 
          className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
        </Link>

        <header className="text-center">
          <div className="relative w-28 h-28 mx-auto mb-3">
            <div className="w-full h-full rounded-3xl bg-primary/5 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-14 h-14 text-primary/40" />
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 bg-primary p-2.5 rounded-2xl shadow-lg border-4 border-white text-white"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <h1 className="text-xl font-bold text-foreground">Perfil Profissional</h1>
          <p className="text-xs text-muted-foreground">Suas informações visíveis para os pacientes</p>
        </header>

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in zoom-in">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <p className="text-sm font-bold text-primary">Perfil profissional atualizado!</p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Registro Profissional */}
          <section className="bg-card p-5 rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-border/50 space-y-4">
            <h2 className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1 flex items-center gap-2">
              <Award className="w-3 h-3" /> Credenciais
            </h2>
            
            <div className="space-y-3">
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input placeholder="Nome Profissional (Ex: Dra. Ana)" className="w-full h-12 pl-10 pr-4 rounded-2xl bg-muted/30 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="relative">
                <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input placeholder="Cédula Profissional / Registro" className="w-full h-12 pl-10 pr-4 rounded-2xl bg-muted/30 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
          </section>

          {/* Especialidades e Educação */}
          <section className="bg-card p-5 rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-border/50 space-y-4">
            <h2 className="text-[10px] font-bold text-[#5b8def] uppercase tracking-widest ml-1 flex items-center gap-2">
              <GraduationCap className="w-3 h-3" /> Formação & Foco
            </h2>
            
            <div className="space-y-3">
              <textarea 
                placeholder="Resumo de especialidades (Ex: Nutrição Desportiva, Emagrecimento...)" 
                className="w-full h-24 p-4 rounded-2xl bg-muted/30 border border-border text-sm outline-none focus:ring-2 focus:ring-[#5b8def]/20 resize-none"
              />
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input placeholder="Local de Atendimento" className="w-full h-12 pl-10 pr-4 rounded-2xl bg-muted/30 border border-border text-sm outline-none focus:ring-2 focus:ring-[#5b8def]/20" />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input placeholder="WhatsApp para Pacientes" className="w-full h-12 pl-10 pr-4 rounded-2xl bg-muted/30 border border-border text-sm outline-none focus:ring-2 focus:ring-[#5b8def]/20" />
              </div>
            </div>
          </section>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/30 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? "Salvando..." : "Salvar Perfil Profissional"}
          </button>
        </form>
      </main>
    </div>
  )
}