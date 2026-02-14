from src.repositories.supabase_client import supabase
from src.models.user import Usuario
from typing import List

class NutricionistaRepository:
    def listar_pacientes(self, nutri_id: str) -> List[Usuario]:
        """
        Lista todos os pacientes vinculados a um nutricionista específico.
        Retorna ordenado pelo 'attention_score' (decrescente) para destacar os casos mais graves no topo.
        """
        # Busca usuários filtrando pelo nutri_id
        response = supabase.table("users")\
            .select("*")\
            .eq("nutri_id", nutri_id)\
            .order("attention_score", desc=True)\
            .execute()
            
        pacientes = []
        for user_data in response.data:
            try:
                # Converte o dicionário do Supabase para o nosso Modelo Pydantic Usuario
                pacientes.append(Usuario(**user_data))
            except Exception as e:
                print(f"Erro ao processar dados do paciente {user_data.get('id')}: {e}")
                
        return pacientes

    def atualizar_score_atencao(self, paciente_id: str, novo_score: int):
        """
        Permite atualizar manualmente o score de atenção, caso o nutricionista 
        queira intervir ou o sistema recalcule.
        """
        supabase.table("users")\
            .update({"attention_score": novo_score})\
            .eq("id", paciente_id)\
            .execute()