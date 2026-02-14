"use client"

import { Header } from "@/components/nutrition/header"
import { BottomNav } from "@/components/nutrition/bottom-nav"
import { 
  User, Calendar, AlertTriangle, Leaf, 
  Dumbbell, Candy, ArrowLeft, Mail, Clock 
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function PerfilPacienteDetalhado() {
  const params = useParams()
  
  // Captura o ID da pasta [paciente_id] de forma segura
  const pacienteId = params?.paciente_id

  // Simulando os dados do paciente (futuramente virão de um fetch usando o pacienteId)
  const paciente = {
    nome: "João Silva",
    idade: 28,
    sexo: "Masculino",
    alergenos: "Lactose, Amendoim e Glúten",
    dieta: "Vegetariana",
    exercicio: "3h - 5h por semana",
    paladar: "Salgado",
    email: "joao.silva@email.com"
  }

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative font-sans antialiased">
      <Header />
      
      <main className="p-4 pb-32 space-y-6">
        {/* Navegação de volta ao painel principal da nutri */}
        <Link 
          href="/nutricionista" 
          className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Painel Profissional
        </Link>

        {/* Cabeçalho do Perfil do Paciente */}
        <header className="text-center">
          <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-inner">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">{paciente.nome}</h1>
          <p className="text-xs text-muted-foreground">{paciente.email}</p>
          <p className="text-[10px] text-muted-foreground mt-1 opacity-50 uppercase tracking-tighter">ID: {pacienteId}</p>
        </header>

        <div className="space-y-4">
          {/* CARTÃO DE DADOS BÁSICOS */}
          <section className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-3">
            <h2 className="text-[10px] font-bold text-primary uppercase tracking-widest">Informações Gerais</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/30 p-3 rounded-xl">
                <p className="text-[9px] text-muted-foreground uppercase font-bold">Idade</p>
                <p className="text-sm font-bold">{paciente.idade} anos</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-xl">
                <p className="text-[9px] text-muted-foreground uppercase font-bold">Sexo</p>
                <p className="text-sm font-bold">{paciente.sexo}</p>
              </div>
            </div>
          </section>

          {/* CARTÃO DE ALERTAS */}
          <section className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-3">
            <h2 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle className="w-3 h-3" /> Restrições Médicas
            </h2>
            <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl">
              <p className="text-xs text-orange-800 font-medium">{paciente.alergenos}</p>
            </div>
          </section>

          {/* CARTÃO DE HÁBITOS */}
          <section className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-3">
            <h2 className="text-[10px] font-bold text-[#5b8def] uppercase tracking-widest">Dieta e Atividade</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-medium"><Leaf className="w-4 h-4 text-primary" /> Tipo de Dieta</div>
                <span className="text-xs font-bold">{paciente.dieta}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-medium"><Dumbbell className="w-4 h-4 text-[#5b8def]" /> Treino Semanal</div>
                <span className="text-xs font-bold">{paciente.exercicio}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-medium"><Candy className="w-4 h-4 text-pink-500" /> Preferência</div>
                <span className="text-xs font-bold uppercase">{paciente.paladar}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Botão de Ação Profissional */}
        <button className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:brightness-105 active:scale-[0.98] transition-all">
          Gerar Novo Plano Alimentar
        </button>
      </main>

      <BottomNav />
    </div>
  )
}