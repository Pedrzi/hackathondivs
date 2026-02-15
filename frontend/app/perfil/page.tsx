"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const IMAGENS_PRATOS = {
  "Panquecas": "/assets/pancakes.jpg",
  "Ovos": "/assets/scrambledEggs.jpg",
  "Fruta": "/assets/yogurtFruitBowl.jpg",
  "Massa": "/assets/spaghetti.jpg",
  "Grelhado": "/assets/grilledChickenRice.jpg",
  "Salada": "/assets/greenSaladBowl.jpg",
  "Sopa": "/assets/vegetableSoupBowl.jpg",
  "Peixe": "/assets/bakedSalmonVegetables.jpg",
  "Leve": "/assets/fruitSalad.jpg",
  "Doce": "/assets/chocolateDessert.jpg",
  "Café": "/assets/coffe.jpg",
};

export default function PerfilNutrium() {
  const router = useRouter();
  const [enviado, setEnviado] = useState(false);
  const [progresso, setProgresso] = useState(0);

  const [form, setForm] = useState({
    nome: "",
    idade: "",
    agua: 4,
    objetivo: "",
    dieta: "",
    alergias: [] as string[],
    outra_restricao: "",
    paladar: "Neutro",
    escolhas: { pequeno_almoco: "", almoco: "", jantar: "", sobremesa: "" }
  });

  // Cálculo de progresso para a barra superior
  useEffect(() => {
    let p = 0;
    if (form.nome && form.idade) p += 20;
    if (form.dieta && form.objetivo) p += 20;
    const meals = Object.values(form.escolhas).filter(v => v !== "").length;
    p += (meals * 15);
    setProgresso(Math.min(p, 100));
  }, [form]);

  const handleIdade = (val: string) => {
    const n = parseInt(val);
    if (val === "" || (n >= 0 && n <= 110)) setForm({...form, idade: val});
  };

  const toggleAlergia = (al: string) => {
    setForm(prev => ({
      ...prev,
      alergias: prev.alergias.includes(al) ? prev.alergias.filter(a => a !== al) : [...prev.alergias, al]
    }));
  };

  const onSubmit = async () => {
    try {
      // Dica: Se fores testar no telemóvel, muda o localhost para o teu IP!
      const res = await fetch("http://localhost:8000/api/perfil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), 
      });
      if (res.ok) setEnviado(true);
    } catch (err) {
      // Fallback local se o backend do Pedro estiver offline
      console.warn("API Offline. Guardando no browser...");
      localStorage.setItem("nutrium_backup", JSON.stringify(form));
      setEnviado(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-20 font-sans text-slate-900">
      
      {/* Progresso */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-200 z-[100]">
        <div className="h-full bg-[#27ae60] transition-all duration-700 ease-out" style={{ width: `${progresso}%` }} />
      </div>

      <header className="bg-white p-6 pt-10 shadow-sm border-b border-slate-100 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <h1 className="text-lg font-black uppercase tracking-tight text-[#27ae60]">Perfil Nutrium++</h1>
        <div className="w-8" /> 
      </header>

      <main className="max-w-xl mx-auto p-5 space-y-6">
        
        {enviado && (
          <div className="bg-green-500 text-white p-5 rounded-2xl shadow-lg text-center font-bold animate-in fade-in zoom-in duration-300">
            ✅ Dados Sincronizados com Sucesso!
          </div>
        )}

        {/* 1. Identificação - FIXED PARA MOBILE */}
        <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">Identificação</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" placeholder="Nome completo" 
              className="flex-1 p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-[#27ae60] focus:bg-white outline-none transition-all"
              onChange={(e) => setForm({...form, nome: e.target.value})}
            />
            <input 
              type="number" placeholder="Idade" 
              className="w-full sm:w-24 p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-[#27ae60] focus:bg-white outline-none transition-all"
              value={form.idade}
              onChange={(e) => handleIdade(e.target.value)}
            />
          </div>
        </section>

        {/* 2. Hidratação */}
        <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">Hidratação (Copos/Dia)</label>
          <div className="flex items-center gap-4 p-2">
            <span className="text-2xl">💧</span>
            <input 
              type="range" min="0" max="15" value={form.agua} 
              className="flex-1 accent-[#27ae60]" 
              onChange={(e) => setForm({...form, agua: parseInt(e.target.value)})} 
            />
            <span className="font-bold text-[#27ae60] min-w-[20px]">{form.agua}</span>
          </div>
        </section>

        {/* 3. Restrições e Dieta */}
        <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 text-center">Tipo de Dieta</label>
            <div className="grid grid-cols-2 gap-2">
              {["Vegetariana", "Vegana", "Keto", "Nenhuma"].map(t => (
                <button 
                  key={t} onClick={() => setForm({...form, dieta: t})}
                  className={`py-3 rounded-xl font-bold text-[10px] border-2 transition-all ${form.dieta === t ? "bg-[#27ae60] border-[#27ae60] text-white" : "bg-slate-50 border-transparent text-slate-400"}`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 text-center">Alergias</label>
            <div className="grid grid-cols-2 gap-2">
              {["Lactose", "Glúten", "Nozes", "Marisco"].map(al => (
                <button 
                  key={al} onClick={() => toggleAlergia(al)}
                  className={`py-3 rounded-xl font-bold text-[10px] border-2 transition-all ${form.alergias.includes(al) ? "bg-red-50 border-red-100 text-red-600" : "bg-slate-50 border-transparent text-slate-400"}`}
                >
                  {al.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Escolhas Visuais */}
        {[
          { id: "pequeno_almoco", label: "Pequeno-Almoço", options: ["Panquecas", "Ovos", "Fruta"] },
          { id: "almoco", label: "Almoço", options: ["Massa", "Grelhado", "Salada"] },
          { id: "jantar", label: "Jantar", options: ["Sopa", "Peixe", "Leve"] }
        ].map((meal) => (
          <section key={meal.id} className="space-y-3">
            <h4 className="text-[10px] font-black text-center text-slate-400 uppercase tracking-[0.2em]">{meal.label}</h4>
            <div className="grid grid-cols-3 gap-3">
              {meal.options.map(item => (
                <button 
                  key={item}
                  onClick={() => setForm({...form, escolhas: {...form.escolhas, [meal.id]: item}})}
                  className={`relative aspect-square rounded-[2rem] overflow-hidden border-4 transition-all ${ (form.escolhas as any)[meal.id] === item ? "border-[#27ae60] scale-105 shadow-lg" : "border-white"}`}
                >
                  <img src={(IMAGENS_PRATOS as any)[item]} alt={item} className="absolute inset-0 w-full h-full object-cover" />
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center p-2 transition-opacity ${ (form.escolhas as any)[meal.id] === item ? "opacity-20" : "opacity-50"}`}>
                    <span className="text-[8px] text-white font-black uppercase text-center">{item}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}

        <button 
          onClick={onSubmit}
          className="w-full bg-[#27ae60] text-white font-black py-6 rounded-[2.5rem] shadow-xl active:scale-[0.98] transition-all text-lg mt-8 hover:shadow-2xl hover:bg-[#219150]"
        >
          CONFIRMAR PERFIL
        </button>

      </main>
    </div>
  );
}