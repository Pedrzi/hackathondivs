from fastapi import APIRouter, HTTPException, Query
from src.repositories.pantry_repository import DispensaRepository
from src.services.openfoodfacts import OpenFoodFactsService
from src.models.products import Produto, ItemDispensa
from src.repositories.supabase_client import supabase # Precisamos para salvar o produto novo
from typing import List

router = APIRouter(prefix="/api/dispensa", tags=["Dispensa"])
repo = DispensaRepository()
off_service = OpenFoodFactsService() # Serviço da API externa

# ID Fixo para a Hackathon
USUARIO_PADRAO_ID = "00000000-0000-0000-0000-000000000000" 

@router.get("", response_model=List[ItemDispensa])
def get_minha_dispensa():
    try:
        return repo.listar_itens_do_usuario(USUARIO_PADRAO_ID)
    except Exception as e:
        print(f"Erro ao listar: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/adicionar/{codigo_barras}")
def adicionar_produto_dispensa(
    codigo_barras: str, 
    quantidade: int = Query(1, description="Quantidade a adicionar ou remover (ex: -1)")
):
    """
    Adiciona itens à dispensa.
    Se o produto não existir no banco local, busca no OpenFoodFacts e cadastra automaticamente.
    """
    try:
        # 1. Tenta adicionar direto (Caminho feliz)
        repo.adicionar_item(USUARIO_PADRAO_ID, codigo_barras, quantidade=quantidade)
        acao = "adicionado" if quantidade > 0 else "removido"
        return {"mensagem": f"Produto {acao} com sucesso!", "delta": quantidade}

    except Exception as e:
        # 2. Se falhou, verificamos se é porque o produto não existe (Erro de Foreign Key ou similar)
        # Para garantir, tentamos buscar no OFF se a quantidade for positiva (estamos adicionando)
        if quantidade > 0:
            print(f"⚠️ Produto {codigo_barras} não encontrado no DB local. Buscando no OpenFoodFacts...")
            
            dados_off = off_service.buscar_produto_por_codigo(codigo_barras)
            
            if not dados_off:
                raise HTTPException(status_code=404, detail="Produto não encontrado nem no sistema nem no OpenFoodFacts.")
            
            # 3. Formata e Salva o Produto na tabela 'products'
            produto_novo = Produto.criar_do_openfoodfacts(dados_off)
            
            # Convertemos para dict para salvar no Supabase
            produto_db = {
                "id": produto_novo.id_codigo_barras,
                "name": produto_novo.nome,
                "brand": produto_novo.marca,
                # CORREÇÃO CRÍTICA: Converter float para int, pois a coluna DB é bigint (int8)
                "weight": int(produto_novo.quantidade_embalagem_g), 
                "image": dados_off.get("image_url"), # URL da imagem
                "nutri_info": produto_novo.info_nutricional.model_dump() # JSON dos macros
            }
            
            try:
                supabase.table("products").upsert(produto_db).execute()
                print(f"✅ Produto {produto_novo.nome} cadastrado no catálogo global.")
                
                # 4. Tenta adicionar na dispensa novamente
                repo.adicionar_item(USUARIO_PADRAO_ID, codigo_barras, quantidade=quantidade)
                return {"mensagem": f"Produto novo cadastrado e adicionado à dispensa!", "delta": quantidade}
                
            except Exception as e_db:
                print(f"Erro crítico ao salvar produto novo: {e_db}")
                raise HTTPException(status_code=500, detail=f"Erro ao cadastrar produto novo: {str(e_db)}")

        # Se não foi erro de produto faltante ou se estava removendo, relança o erro original
        raise HTTPException(status_code=400, detail=str(e))