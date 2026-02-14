from src.repositories.supabase_client import supabase
from src.models.products import Produto, ItemDispensa, Macros
from typing import List

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
                id_codigo_barras=produto_raw["id"],
                nome=produto_raw["name"],
                marca=produto_raw.get("brand", "Genérico"),
                quantidade_embalagem_g=produto_raw.get("weight", 0),
                info_nutricional=Macros(**produto_raw["nutri_info"]), # Desempacota o JSON
                dados_brutos=None
            )
            
            itens_formatados.append(ItemDispensa(
                produto=produto_obj,
                quantidade_unidades=item["quantity"]
            ))
            
        return itens_formatados

    def adicionar_item(self, user_id: str, codigo_barras: str, quantidade: int = 1):
        """
        Adiciona itens à dispensa. Se já existir, SOMA à quantidade atual.
        """
        # 1. Pega ID da dispensa
        resp_pantry = supabase.table("pantries").select("id").eq("user_id", user_id).execute()
        if not resp_pantry.data:
            raise Exception("Dispensa não encontrada")
        pantry_id = resp_pantry.data[0]["id"]

        # 2. Verificar se o item já existe para pegar a quantidade atual
        # Usamos 'product_id' conforme sua nova convenção
        item_existente = supabase.table("pantry_items")\
            .select("quantity")\
            .eq("pantry_id", pantry_id)\
            .eq("product_id", codigo_barras)\
            .execute()

        quantidade_final = quantidade

        # Se já existe, somamos a quantidade atual com a nova
        if item_existente.data:
            quantidade_atual = item_existente.data[0]["quantity"]
            quantidade_final += quantidade_atual

        # 3. Upsert com a quantidade SOMADA
        data = {
            "pantry_id": pantry_id,
            "product_id": codigo_barras,
            "quantity": quantidade_final
        }
        
        # O on_conflict garante que atualiza a linha existente baseada na chave composta
        # Certifique-se de ter criado a constraint UNIQUE no banco: (pantry_id, product_id)
        result = supabase.table("pantry_items")\
            .upsert(data, on_conflict="pantry_id, product_id")\
            .execute()
        
        return result.data