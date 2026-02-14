"use client";

import { useState } from "react";

// Opções baseadas na tua demo anterior
const OPCOES_COMIDA = [
  { id: "Ovos", label: "Ovos e Bacon", icon: "🍳" },
  { id: "Salada", label: "Saladas Frescas", icon: "🥗" },
  { id: "Pizza", label: "Pizza/Fast Food", icon: "🍕" },
  { id: "Fruta", label: "Frutas e Iogurte", icon: "🍎" },
  { id: "Peixe", label: "Peixe Grelhado", icon: "🐟" },
  { id: "Doce", label: "Doces/Sobremesas", icon: "🍰" },
];

export default function PerfilPage() {
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [nome, setNome] = useState("");

  const toggleOpcao = (id: string) => {
    setSelecionados(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSincronizar = async () => {
    // Aqui ligaremos ao teu backend/supabase quando a equipa der o OK
    console.log("Sincronizando perfil para:", nome, selecionados);
    alert("Perfil guardado localmente! Pronto para sincronizar com o Nutrium.");
  };

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-green-600">Nutrium++</h1>
        <p className="text-gray-500 text-lg">Vamos personalizar o teu plano.</p>
      </header>

      <section className="space-y-6">
        {/* Input de Nome */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Qual é o teu nome?</label>
          <input 
            type="text" 
            placeholder="Ex: Esteban"
            className="w-full border-2 border-gray-100 p-4 rounded-2xl focus:border-green-500 outline-none transition-all"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        {/* Grelha de Seleção Visual */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-4">O que costumas comer mais?</label>
          <div className="grid grid-cols-2 gap-4">
            {OPCOES_COMIDA.map((item) => (
              <div 
                key={item.id}
                onClick={() => toggleOpcao(item.id)}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${
                  selecionados.includes(item.id) 
                    ? "border-green-500 bg-green-50" 
                    : "border-gray-50 bg-gray-50"
                }`}
              >
                <span className="text-4xl">{item.icon}</span>
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Botão de Ação - Conforme a tua imagem do botão de sincronização */}
      <footer className="mt-12">
        <button 
          onClick={handleSincronizar}
          className="w-full bg-green-600 text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-green-700 active:scale-95 transition-all"
        >
          SINCRONIZAR COM NUTRIUM
        </button>
      </footer>
    </div>
  );
}