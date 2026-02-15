from src.repositories.supabase_client import supabase
from src.models.user import Usuario
from typing import List, Dict

class MealPlansRepository:
    def buscar_usuario(self, user_id: str) -> List[Usuario]:
        """
        Lista todos os pacientes vinculados a um nutricionista específico.
        Retorna ordenado pelo 'attention_score' (decrescente) para destacar os casos mais graves no topo.
        """
        # Busca usuários filtrando pelo nutri_id
        response = supabase.table("users")\
            .select("*")\
            .eq("id", user_id)\
            .execute()
            
        try:
            # Converte o dicionário do Supabase para o nosso Modelo Pydantic Usuario
            user = Usuario(**response.data)
        except Exception as e:
            print(f"Erro ao processar dados do paciente {response.data.get('id')}: {e}")

        return user