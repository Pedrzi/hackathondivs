from fastapi import APIRouter, HTTPException
from src.repositories.pantry_repository import DispensaRepository
from typing import List
from src.models.products import ItemDispensa

router = APIRouter(prefix="/api/dispensa", tags=["Dispensa"])
repo = DispensaRepository()

# --- HARDCODED USER ID PARA A HACKATHON ---
# Este UUID deve existir na sua tabela 'users' do Supabase.
# Crie um lá e cole aqui.
USUARIO_PADRAO_ID = "00000000-0000-0000-0000-000000000000" 

@router.get("/", response_model=List[ItemDispensa])
def get_minha_dispensa():
    """
    Retorna os produtos da dispensa do usuário padrão (Hackathon mode).
    """
    try:
        itens = repo.listar_itens_do_usuario(USUARIO_PADRAO_ID)
        return itens
    except Exception as e:
        print(f"Erro: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/adicionar/{codigo_barras}")
def adicionar_produto_dispensa(codigo_barras: str):
    """
    Adiciona 1 unidade do produto escaneado à dispensa do usuário padrão.
    """
    try:
        repo.adicionar_item(USUARIO_PADRAO_ID, codigo_barras, quantidade=1)
        return {"mensagem": "Produto adicionado com sucesso!"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))