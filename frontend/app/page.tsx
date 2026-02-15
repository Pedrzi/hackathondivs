"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F4F7F6] font-sans text-black">
      {/* Hero Section */}
      <nav className="bg-white p-6 shadow-sm flex justify-between items-center border-b-2 border-green-100">
        <h1 className="text-2xl font-black text-[#27ae60] tracking-tighter">NUTRIUM++</h1>
        <div className="space-x-4">
          <Link href="/perfil" className="bg-[#27ae60] text-white px-6 py-2 rounded-full font-bold hover:bg-[#219150] transition-all text-sm">
            O MEU PERFIL
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto pt-16 px-6 text-center">
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="bg-green-100 text-[#27ae60] px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            Hackathon Edition 2026
          </span>
          <h2 className="text-6xl font-black mt-6 leading-tight">
            Nutrição Inteligente <br />
            <span className="text-[#27ae60]">Baseada em IA.</span>
          </h2>
          <p className="text-gray-500 mt-6 text-lg max-w-xl mx-auto">
            Personaliza a tua dieta, gere as tuas alergias e descobre o cardápio ideal para o teu estilo de vida.
          </p>
        </div>

        {/* Quick Actions Card */}
        <div className="grid md:grid-cols-2 gap-6 mt-16">
          <Link href="/perfil" className="group bg-white p-8 rounded-[40px] shadow-sm border-2 border-transparent hover:border-[#27ae60] transition-all text-left relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-4xl mb-4 block">🧪</span>
              <h3 className="text-xl font-black mb-2">Configurar Perfil IA</h3>
              <p className="text-sm text-gray-400">Define as tuas alergias, paladar e objetivos nutricionais em 2 minutos.</p>
            </div>
            <div className="absolute -right-4 -bottom-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity">🥗</div>
          </Link>

          <Link href="/cardapios" className="group bg-white p-8 rounded-[40px] shadow-sm border-2 border-transparent hover:border-[#27ae60] transition-all text-left relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-4xl mb-4 block">📅</span>
              <h3 className="text-xl font-black mb-2">Ver Cardápios</h3>
              <p className="text-sm text-gray-400">Acede às receitas filtradas especificamente para o teu perfil técnico.</p>
            </div>
            <div className="absolute -right-4 -bottom-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity">🍲</div>
          </Link>
        </div>

        {/* Estatísticas Fictícias para a Demo */}
        <div className="mt-20 grid grid-cols-3 gap-8 border-t border-gray-200 pt-12 text-center">
          <div>
            <p className="text-3xl font-black text-[#27ae60]">100%</p>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Personalizado</p>
          </div>
          <div>
            <p className="text-3xl font-black text-[#27ae60]">RAW</p>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Data Processing</p>
          </div>
          <div>
            <p className="text-3xl font-black text-[#27ae60]">API</p>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">FastAPI Sync</p>
          </div>
        </div>
      </main>
      
      <footer className="mt-20 text-center pb-10">
        <p className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">Desenvolvido pela Equipa Nutrium++ | Braga 2026</p>
      </footer>
    </div>
  );
}