from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.repositories.supabase_client import supabase
from typing import List

router = APIRouter(prefix="/api/perfil", tags=["Perfil"])

# Mapeo técnico que definimos en la demo
METADATA_ALIMENTOS = {
    "Panquecas": "Indulgente", "Ovos": "Saudável", "Fruta": "Saudável",
    "Massa": "Conveniência", "Grelhado": "Saudável", "Salada": "Saudável",
    "Sopa": "Leve", "Peixe": "Saudável", "Doce": "Indulgente"
}

class PerfilData(BaseModel):
    user_id: str
    nome: str
    idade: int
    dieta: str
    alergias: List[str]
    escolhas: List[str]

@router.post("/sync")
def sincronizar_perfil(data: PerfilData):
    try:
        # Lógica del Motor de Clasificación
        puntos_saudavel = sum(1 for e in data.escolhas if METADATA_ALIMENTOS.get(e) == "Saudável")
        
        # Calculamos un attention_score inicial basado en salud (0 es bueno, 10 es riesgo)
        # Si elige pocas cosas saludables, el score sube
        novo_score = 10 - (puntos_saudavel * 2)
        novo_score = max(0, min(10, novo_score))

        # Actualizamos Supabase
        supabase.table("users").update({
            "age": data.idade,
            "attention_score": novo_score,
            # Aquí podrías añadir columnas nuevas como 'diet' o 'allergies' si las creas en el DB
        }).eq("id", data.user_id).execute()

        return {"status": "success", "persona": "Saudável" if puntos_saudavel >= 2 else "Conveniência"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))