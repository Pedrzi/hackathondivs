"use client";

import { useState } from "react";

// Mapeamento técnico transportado da tua demo
const METADATA_ALIMENTOS: Record<string, { perfil: string; icon: string }> = {
  "Panquecas": { perfil: "Indulgente", icon: "🥞" },
  "Ovos": { perfil: "Saudável", icon: "🍳" },
  "Fruta": { perfil: "Saudável", icon: "🍎" },
  "Massa": { perfil: "Conveniência", icon: "🍝" },
  "Grelhado": { perfil: "Saudável", icon: "🍗" },
  "Salada": { perfil: "Saudável", icon: "🥗" },
  "Sopa": { perfil: "Leve", icon: "🥣" },
  "Peixe": { perfil: "Saudável", icon: "🐟" },
  "Leve": { perfil: "Conveniência", icon: "🥪" },
  "Doce": { perfil: "Indulgente", icon: "🍦" },
  "Café": { perfil: "Funcional", icon: "☕" },
};

export default function PerfilPage() {
  const [respostas, setRespostas] = useState({
    nome: "",
    idade: "",
    dieta: "",
    alergias: [] as string[],
    preferencia_paladar: "Doce",
    escolhas: { pequeno_almoco: "", almoco: "", jantar: "", sobremesa: "" }
  });

  const [persona, setPersona] = useState<string | null>(null);

  const handleEscolha = (refeicao: string, prato: string) => {
    setRespostas({
      ...respostas,
      escolhas: { ...respostas.escolhas, [refeicao]: prato }
    });
  };

  const finalizarECategorizar = () => {
    let puntosSaudavel = 0;
    let puntosIndulgente = 0;

    Object.values(respostas.escolhas).forEach(escolha => {
      if (METADATA_ALIMENTOS[escolha]?.perfil === "Saudável") puntosSaudavel++;
      if (METADATA_ALIMENTOS[escolha]?.perfil === "Indulgente") puntosIndulgente++;
    });

    let resultado = "Utilizador de Conveniência";
    if (puntosSaudavel >= 2) resultado = "Utilizador Saudável Consistente";
    else if (puntosIndulgente >= 1) resultado = "Utilizador Indulgente Ocasional";

    setPersona(resultado);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] pb-20 font-sans">
      {/* Header igual ao Flet */}
      <div className="bg-white p-8 shadow-sm text-center border-b-4 border-[#27ae60]">
        <h1 className="text-4xl font-black text-[#27ae60] mb-2">Personalização Nutrium</h1>
        <p className="text-gray-500 italic">Motor de Classificação de Personas</p>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-10">
        
        {persona && (
          <div className="bg-[#27ae60] text-white p-6 rounded-3xl shadow-xl text-center animate-bounce">
            <h2 className="text-xl font-bold">Perfil Sincronizado!</h2>
            <p className="text-2xl font-black mt-2">{persona}</p>
          </div>
        )}

        {/* 1. Identificação */}
        <section className="bg-white p-6 rounded-3xl shadow-sm">
          <h3 className="text-[#27ae60] font-bold text-lg mb-4 underline decoration-2">1. Identificação</h3>
          <div className="flex gap-4">
            <input 
              type="text" placeholder="Nome" 
              className="flex-1 p-4 rounded-2xl border-2 border-gray-100 focus:border-[#27ae60] outline-none"
              onChange={(e) => setRespostas({...respostas, nome: e.target.value})}
            />
            <input 
              type="number" placeholder="Idade" 
              className="w-24 p-4 rounded-2xl border-2 border-gray-100 focus:border-[#27ae60] outline-none"
              onChange={(e) => setRespostas({...respostas, idade: e.target.value})}
            />
          </div>
        </section>

        {/* 2. Estilo e Alergias */}
        <section className="bg-white p-6 rounded-3xl shadow-sm">
          <h3 className="text-[#27ae60] font-bold text-lg mb-4 underline decoration-2">2. Estilo e Alergias</h3>
          <select 
            className="w-full p-4 rounded-2xl border-2 border-gray-100 mb-6 outline-none bg-white"
            onChange={(e) => setRespostas({...respostas, dieta: e.target.value})}
          >
            <option value="">Estilo de Alimentação</option>
            <option value="Vegetariana">Vegetariana</option>
            <option value="Vegana">Vegana</option>
            <option value="Keto">Keto / Low Carb</option>
          </select>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {["Lactose", "Glúten", "Frutos Secos", "Marisco"].map(al => (
              <label key={al} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                <input type="checkbox" className="accent-[#27ae60] w-5 h-5" /> {al}
              </label>
            ))}
          </div>
        </section>

        {/* Seleção Visual de Refeições com Emojis */}
        {[
          { key: "pequeno_almoco", label: "Pequeno-Almoço", itens: ["Panquecas", "Ovos", "Fruta"] },
          { key: "almoco", label: "Almoço", itens: ["Massa", "Grelhado", "Salada"] },
          { key: "jantar", label: "Jantar", itens: ["Sopa", "Peixe", "Leve"] },
          { key: "sobremesa", label: "Sobremesa", itens: ["Café", "Fruta", "Doce"] }
        ].map((refeicao) => (
          <section key={refeicao.key}>
            <h3 className="text-[#27ae60] font-bold text-center text-lg mb-4">{refeicao.label}</h3>
            <div className="grid grid-cols-3 gap-3">
              {refeicao.itens.map(item => (
                <div 
                  key={item}
                  onClick={() => handleEscolha(refeicao.key, item)}
                  className={`p-4 rounded-3xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${
                    (respostas.escolhas as any)[refeicao.key] === item 
                      ? "border-[#27ae60] bg-green-50" 
                      : "border-gray-50 bg-white"
                  }`}
                >
                  <span className="text-4xl">{METADATA_ALIMENTOS[item]?.icon}</span>
                  <span className="font-bold text-[10px] uppercase">{item}</span>
                  {/* Espaço reservado para imagem futura: <div className="hidden bg-gray-200 w-full h-12 rounded-lg"></div> */}
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Botão Final */}
        <button 
          onClick={finalizarECategorizar}
          className="w-full bg-[#27ae60] text-white font-black py-6 rounded-3xl shadow-2xl hover:bg-[#219150] active:scale-95 transition-all text-xl"
        >
          FINALIZAR E CATEGORIZAR
        </button>

      </div>
    </div>
  );
}