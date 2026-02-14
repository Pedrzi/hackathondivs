from src.repositories.supabase_client import supabase
from src.models.products import Produto, ItemDispensa, Macros
from typing import List
from uuid import UUID

class DispensaRepository:
    def listar_itens_do_usuario(self, user_id: str) -> List[ItemDispensa]:
        """
        1. Descobre qual é a pantry_id do usuário.
        2. Busca os itens dessa pantry + dados do produto (JOIN).
        """
        
        # Passo 1: Buscar o ID da dispensa na tabela 'pantries'
        # Assumindo que a tabela pantries tem a coluna user_id
        response_pantry = supabase.table("pantries")\
            .select("id")\
            .eq("user_id", user_id)\
            .execute()
            
        if not response_pantry.data:
            return [] # Usuário sem dispensa
            
        pantry_id = response_pantry.data[0]["id"]

        # Passo 2: Buscar itens e fazer JOIN com produtos
        # A sintaxe 'products(*)' diz ao Supabase para trazer todos os campos da tabela relacionada
        response_items = supabase.table("pantry_items")\
            .select("quantity, products(*)")\
            .eq("pantry_id", pantry_id)\
            .execute()

        itens_formatados = []
        
        for item in response_items.data:
            produto_raw = item["products"]
            
            # Converter JSON do banco para nosso Modelo Pydantic
            # (Reaproveitando a lógica que já criamos antes)
            produto_obj = Produto(
                id_codigo_barras=produto_raw["barcode"],
                nome=produto_raw["name"],
                marca=produto_raw.get("brand", "Genérico"),
                quantidade_embalagem_g=produto_raw.get("total_weight_g", 0),
                info_nutricional=Macros(**produto_raw["nutrition_info"]), # Desempacota o JSON
                dados_brutos=None
            )
            
            itens_formatados.append(ItemDispensa(
                produto=produto_obj,
                quantidade_unidades=item["quantity"]
            ))
            
        return itens_formatados

    def adicionar_item(self, user_id: str, codigo_barras: str, quantidade: int = 1):
        """
        Adiciona um item à dispensa do usuário padrão.
        """
        # 1. Pega ID da dispensa
        resp_pantry = supabase.table("pantries").select("id").eq("user_id", user_id).execute()
        if not resp_pantry.data:
            raise Exception("Dispensa não encontrada")
        pantry_id = resp_pantry.data[0]["id"]

        # 2. Insere na tabela intermediária (Upsert para somar se já existir seria ideal, mas insert simples para hackathon)
        data = {
            "pantry_id": pantry_id,
            "product_barcode": codigo_barras,
            "quantity": quantidade
        }
        
        # Upsert: se já existe, atualiza. (Requer que a constraint UNIQUE esteja criada no banco)
        supabase.table("pantry_items").upsert(data, on_conflict="pantry_id, product_barcode").execute()