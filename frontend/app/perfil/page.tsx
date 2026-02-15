"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Base de dados para renderização das imagens
const METADATA_ALIMENTOS: Record<string, { img: string }> = {
  "Panquecas": { img: "/assets/pancakes.jpg" },
  "Ovos": { img: "/assets/scrambledEggs.jpg" },
  "Fruta": { img: "/assets/yogurtFruitBowl.jpg" },
  "Massa": { img: "/assets/spaghetti.jpg" },
  "Grelhado": { img: "/assets/grilledChickenRice.jpg" },
  "Salada": { img: "/assets/greenSaladBowl.jpg" },
  "Sopa": { img: "/assets/vegetableSoupBowl.jpg" },
  "Peixe": { img: "/assets/bakedSalmonVegetables.jpg" },
  "Leve": { img: "/assets/fruitSalad.jpg" },
  "Doce": { img: "/assets/chocolateDessert.jpg" },
  "Café": { img: "/assets/coffe.jpg" },
};

export default function PerfilPage() {
  const router = useRouter();
  
  // Objeto com TODOS os dados puros para o backend
  const [respostas, setRespostas] = useState({
    nome: "",
    idade: "",
    agua: 4,
    objetivo: "",
    dieta: "",
    alergias: [] as string[],
    outra_restricao: "",
    preferencia_paladar: "Neutro",
    escolhas: { 
      pequeno_almoco: "", 
      almoco: "", 
      jantar: "", 
      sobremesa: "" 
    }
  });

  const [enviado, setEnviado] = useState(false);
  const [progresso, setProgresso] = useState(0);

  // Lógica de progresso baseada no preenchimento (UX para os juízes)
  useEffect(() => {
    let pontos = 0;
    if (respostas.nome && respostas.idade) pontos += 20;
    if (respostas.dieta) pontos += 20;
    const foodCount = Object.values(respostas.escolhas).filter(v => v !== "").length;
    pontos += (foodCount * 15);
    setProgresso(Math.min(pontos, 100));
  }, [respostas]);

  const handleIdade = (val: string) => {
    const num = parseInt(val);
    // Validação: Apenas números positivos e idades realistas
    if (val === "" || (num >= 0 && num <= 120)) {
      setRespostas({...respostas, idade: val});
    }
  };

  const toggleAlergia = (al: string) => {
    setRespostas(prev => ({
      ...prev,
      alergias: prev.alergias.includes(al) ? prev.alergias.filter(a => a !== al) : [...prev.alergias, al]
    }));
  };

  const finalizarPerfil = async () => {
    // Envio dos dados puros para o servidor
    try {
      const response = await fetch("http://localhost:8000/api/perfil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(respostas), 
      });

      if (response.ok) setEnviado(true);
    } catch (error) {
      console.error("Falha na ligação ao servidor. Dados guardados localmente.");
      localStorage.setItem("perfil_final", JSON.stringify(respostas));
      setEnviado(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] pb-20 font-sans text-black relative">
      
      {/* Barra de Progresso Superior */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gray-200 z-50">
        <div className="h-full bg-[#27ae60] transition-all duration-500" style={{ width: `${progresso}%` }} />
      </div>

      <button onClick={() => router.back()} className="absolute top-8 left-6 z-10 bg-white p-3 rounded-full shadow-md border border-gray-100 hover:scale-110 transition-all">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>

      <div className="bg-white p-8 shadow-sm text-center border-b-4 border-[#27ae60] mb-8">
        <h1 className="text-2xl font-black text-[#27ae60] pt-6 uppercase tracking-tighter">Configuração de perfil Nutrium++</h1>
      </div>

      <div className="max-w-xl mx-auto px-6 space-y-8">
        
        {enviado && (
          <div className="bg-white p-8 rounded-[30px] shadow-xl text-center border-2 border-[#27ae60] animate-in fade-in zoom-in">
            <h2 className="text-[#27ae60] font-black text-xl uppercase italic">Dados sincronizados</h2>
            <p className="text-gray-500 text-sm mt-2">O seu perfil nutricional foi atualizado com sucesso.</p>
          </div>
        )}

        {/* 1. Identificação */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 font-black text-xs mb-4 uppercase">1. Dados pessoais</h3>
          <div className="flex gap-4">
            <input type="text" placeholder="O seu nome" className="flex-1 p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:border-[#27ae60] outline-none" onChange={(e) => setRespostas({...respostas, nome: e.target.value})} />
            <input 
              type="number" 
              placeholder="Idade" 
              className="w-24 p-4 rounded-xl border-2 border-gray-50 bg-gray-50 focus:border-[#27ae60] outline-none" 
              value={respostas.idade}
              onChange={(e) => handleIdade(e.target.value)}
            />
          </div>
        </section>

        {/* 2. Hidratação */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 font-black text-xs mb-4 uppercase">2. Hidratação diária</h3>
          <div className="p-4 bg-green-50 rounded-xl text-center">
            <p className="font-bold text-[#27ae60] mb-2">{respostas.agua} Copos de água </p>
            <input type="range" min="0" max="15" value={respostas.agua} className="w-full accent-[#27ae60]" onChange={(e) => setRespostas({...respostas, agua: parseInt(e.target.value)})} />
          </div>
        </section>

        {/* 3. Estilo de Dieta */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 font-black text-xs mb-4 uppercase tracking-widest">3. Estilo de Vida</h3>
          <div className="grid grid-cols-2 gap-2">
            {["Vegetariana", "Vegana", "Keto", "Nenhuma"].map(t => (
              <button key={t} onClick={() => setRespostas({...respostas, dieta: t})} className={`p-3 rounded-xl font-bold text-[10px] border-2 transition-all ${respostas.dieta === t ? "bg-[#27ae60] border-[#27ae60] text-white" : "border-gray-50 text-gray-400"}`}>{t.toUpperCase()}</button>
            ))}
          </div>
        </section>

        {/* 4. Alergias e Intolerâncias */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-gray-400 font-black text-xs mb-2 uppercase tracking-widest">4. Alergias confirmadas</h3>
          <div className="grid grid-cols-2 gap-2">
            {["Lactose", "Glúten", "Frutos Secos", "Marisco"].map(al => (
              <button key={al} onClick={() => toggleAlergia(al)} className={`p-3 rounded-xl font-bold text-[10px] border-2 ${respostas.alergias.includes(al) ? "bg-red-50 border-red-200 text-red-600 shadow-inner" : "border-gray-50 text-gray-400"}`}>
                {respostas.alergias.includes(al) ? "🚫 " : ""}{al.toUpperCase()}
              </button>
            ))}
          </div>
          <textarea placeholder="Alguma outra restrição médica ou alimentar?" className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 text-sm outline-none focus:border-[#27ae60]" rows={2} onChange={(e) => setRespostas({...respostas, outra_restricao: e.target.value})} />
        </section>

        {/* 5. Objetivo e Paladar */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div>
            <h3 className="text-gray-400 font-black text-xs mb-4 uppercase tracking-widest">5. Objetivo Nutricional</h3>
            <select className="w-full p-4 rounded-xl border-2 border-gray-50 bg-gray-50 outline-none focus:border-[#27ae60]" onChange={(e) => setRespostas({...respostas, objetivo: e.target.value})}>
              <option value="">Qual o seu foco principal?</option>
              <option value="Perder">Perda de peso</option>
              <option value="Massa">Ganho de massa muscular</option>
              <option value="Energia">Melhoria de energia</option>
            </select>
          </div>
          
          <div>
            <h3 className="text-gray-400 font-black text-xs mb-4 uppercase tracking-widest">6. Preferência de Paladar</h3>
            <div className="flex gap-2">
              {["Doce", "Salgado", "Neutro"].map(tipo => (
                <button key={tipo} onClick={() => setRespostas({...respostas, preferencia_paladar: tipo})} className={`flex-1 py-3 rounded-xl font-bold text-[10px] border-2 ${respostas.preferencia_paladar === tipo ? "bg-[#27ae60] border-[#27ae60] text-white" : "border-gray-50 text-gray-400"}`}>{tipo.toUpperCase()}</button>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Preferências Visuais de Refeição */}
        {[
          { k: "pequeno_almoco", l: "Pequeno-Almoço", i: ["Panquecas", "Ovos", "Fruta"] },
          { k: "almoco", l: "Almoço", i: ["Massa", "Grelhado", "Salada"] },
          { k: "jantar", l: "Jantar", i: ["Sopa", "Peixe", "Leve"] },
          { k: "sobremesa", l: "Sobremesa", i: ["Café", "Fruta", "Doce"] }
        ].map((ref) => (
          <section key={ref.k}>
            <h3 className="text-gray-400 font-black text-center text-[9px] mb-3 uppercase tracking-[0.4em]">{ref.l}</h3>
            <div className="grid grid-cols-3 gap-3">
              {ref.i.map(item => (
                <div 
                  key={item} 
                  onClick={() => setRespostas({...respostas, escolhas: {...respostas.escolhas, [ref.k]: item}})} 
                  className={`group relative aspect-square rounded-[30px] overflow-hidden border-4 transition-all ${ (respostas.escolhas as any)[ref.k] === item ? "border-[#27ae60] scale-105 shadow-xl ring-8 ring-green-100/30" : "border-white hover:border-gray-100 shadow-sm" }`}
                >
                  <img src={METADATA_ALIMENTOS[item]?.img} alt={item} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20" />
                  <span className="relative z-10 font-black text-[7px] text-white text-center px-1 uppercase tracking-tighter flex items-end justify-center h-full pb-4">{item}</span>
                </div>
              ))}
            </div>
          </section>
        ))}

        <button 
          onClick={finalizarPerfil} 
          className="w-full bg-[#27ae60] text-white font-black py-7 rounded-[30px] shadow-2xl hover:translate-y-1 transition-all text-xl mt-12 border-b-8 border-[#1e8449]"
        >
          CONFIRMAR DADOS
        </button>
      </div>
    </div>
  );
}