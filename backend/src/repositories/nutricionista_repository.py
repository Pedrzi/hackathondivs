from src.repositories.supabase_client import supabase
from src.models.user import Usuario
from typing import List, Dict

novos_usuarios = [
    {
        "age": "27",
        "height": "170",
        "weight": "55",
        "nutri_id": "928f6268-0adf-40e4-bc63-caca92e5f708",
        "pantry_id": "35d42823-812a-487f-856e-3b7f0411ed0a",
        "attention_score": 5
    },
    {
        "age": "60",
        "height": "176",
        "weight": "62",
        "nutri_id": "928f6268-0adf-40e4-bc63-caca92e5f708",
        "pantry_id": "1c38baf1-3e9f-49ce-b672-4888c685ed34",
        "attention_score": 7
    },
    {
        "age": "42",
        "height": "180",
        "weight": "70",
        "nutri_id": "928f6268-0adf-40e4-bc63-caca92e5f708",
        "pantry_id": "850d41a9-e927-4406-9328-76427beec46b",
        "attention_score": 3
    }
]

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
    
    def adiciona_users(self, novos_usuarios: List[Dict]):
        response = supabase.table("users").insert(novos_usuarios).execute()

        if not response.data:
            print("Erro: nenhum usuário inserido")
        else:
            print("Usuários inseridos:", [u['id'] for u in response.data])
