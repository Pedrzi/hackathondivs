from src.repositories.supabase_client import supabase
from src.models.products import Produto

class ProductRepository:
    def listar_produtos(self):
        """
        Lista todos os produtos
        """
        response = supabase.table("produtos")\
            .select("*")\
            .execute()
        
        produtos = []
        for nome in response.data:
            try:
                # Converte o dicionário do Supabase para o nosso Modelo Pydantic Produto
                produtos.append(Produto(**nome))
            except Exception as e:
                print(f"Erro ao processar dados do paciente {nome.get('id')}: {e}")
                
        return produtos