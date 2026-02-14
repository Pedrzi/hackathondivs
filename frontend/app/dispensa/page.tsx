"use client";

import { useEffect, useState } from "react";
import BarcodeScanner from "react-qr-barcode-scanner";

// Tipos basados en tus archivos backend/src/models/products.py y meals.py
interface Macros {
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  lipidos: number;
  fibra: number;
}

interface Produto {
  id_codigo_barras: string;
  nome: string;
  marca: string;
  quantidade_embalagem_g: number;
  info_nutricional: Macros;
}

interface ItemDispensa {
  produto: Produto;
  quantidade_unidades: number;
}

export default function DispensaPage() {
  const [items, setItems] = useState<ItemDispensa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [manualCode, setManualCode] = useState("");

  // URL de tu servidor FastAPI (backend/main.py)
  const API_BASE = "http://localhost:8000/api/dispensa";

  // Carga inicial de la dispensa [GET /api/dispensa/]
  const fetchDispensa = async () => {
    try {
      const res = await fetch(`${API_BASE}/`);
      if (!res.ok) throw new Error("Error al obtener datos");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Error cargando dispensa:", err);
    } finally {
      setLoading(false);
    }
  };

  // Añadir producto por código [POST /api/dispensa/adicionar/{barcode}]
  const handleAdicionar = async (barcode: string) => {
    if (!barcode) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/adicionar/${barcode}`, {
        method: "POST",
      });
      if (res.ok) {
        setShowScanner(false);
        setManualCode("");
        fetchDispensa(); // Recarga la lista
      } else {
        alert("Producto no encontrado o error en el servidor");
      }
    } catch (err) {
      alert("Error de conexión con el backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispensa();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Dispensa Nutrium++</h1>

      {/* Acciones Superiores */}
      <div className="max-w-md mx-auto space-y-4 mb-8">
        <button 
          onClick={() => setShowScanner(true)}
          className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold shadow-md hover:bg-green-700 flex items-center justify-center gap-2"
        >
          <span></span> ESCANEAR CÓDIGO
        </button>

        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="O escribe el código..." 
            className="flex-1 p-3 border rounded-xl"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
          />
          <button 
            onClick={() => handleAdicionar(manualCode)}
            className="bg-gray-800 text-white px-6 rounded-xl font-bold"
          >
            Add
          </button>
        </div>
      </div>

      {/* Modal del Scanner */}
      {showScanner && (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
          <div className="w-full max-w-sm rounded-3xl overflow-hidden border-4 border-green-500">
            <BarcodeScanner
              onUpdate={(err, result) => {
                if (result) handleAdicionar(result.getText());
              }}
            />
          </div>
          <button 
            onClick={() => setShowScanner(false)}
            className="mt-8 text-white bg-red-500/20 px-8 py-2 rounded-full border border-red-500"
          >
            CANCELAR
          </button>
        </div>
      )}

      {/* Listado de Stock */}
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="text-lg font-semibold text-gray-700 px-2">Stock Disponible</h2>
        {loading ? (
          <p className="text-center text-gray-400">Actualizando inventario...</p>
        ) : (
          items.map((item) => (
            <div key={item.produto.id_codigo_barras} className="bg-white p-4 rounded-2xl shadow-sm border flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-900">{item.produto.nome}</p>
                <p className="text-xs text-gray-400">{item.produto.marca}</p>
                <p className="text-xs text-green-600 mt-1 font-medium">
                  {item.produto.info_nutricional.calorias} kcal / 100g
                </p>
              </div>
              
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl">
                {/* Lógica de botones +/- */}
                <button className="w-8 h-8 rounded-lg bg-white border text-gray-400">-</button>
                <span className="font-bold w-6 text-center">{item.quantidade_unidades}</span>
                <button 
                  onClick={() => handleAdicionar(item.produto.id_codigo_barras)}
                  className="w-8 h-8 rounded-lg bg-green-500 text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}