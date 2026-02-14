from fastapi import APIRouter, HTTPException
from typing import List
from uuid import UUID
from src.models.user import Usuario
from src.repositories.nutricionista_repository import NutricionistaRepository

router = APIRouter(prefix="/api/nutricionista", tags=["Nutricionista"])
repo = NutricionistaRepository()

@router.get("/{nutri_id}/pacientes", response_model=List[Usuario])
def obter_meus_pacientes(nutri_id: UUID):
    """
    Retorna a lista de pacientes de um nutricionista.
    Útil para preencher a view principal do dashboard.
    """
    try:
        # Converte UUID para string para a query no Supabase
        return repo.listar_pacientes(str(nutri_id))
    except Exception as e:
        print(f"Erro ao buscar pacientes: {e}")
        raise HTTPException(status_code=500, detail="Erro interno ao buscar lista de pacientes.")

@router.patch("/paciente/{paciente_id}/score")
def atualizar_risco_paciente(paciente_id: UUID, novo_score: int):
    """
    Atualiza o nível de atenção (risco) de um paciente específico.
    """
    try:
        repo.atualizar_score_atencao(str(paciente_id), novo_score)
        return {"mensagem": "Nível de atenção atualizado com sucesso."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))