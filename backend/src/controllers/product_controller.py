from fastapi import APIRouter, HTTPException
from src.services.openfoodfacts import OpenFoodFactsService
from src.models.products import Produto

router = APIRouter(prefix="/produtos", tags=["Produtos"])
service_off = OpenFoodFactsService()

@router.get("/{codigo_barras}", response_model=Produto)
async def obter_produto(codigo_barras: str):
    """
    Busca um produto pelo código de barras.
    1. Tenta buscar no OpenFoodFacts.
    2. Formata para o nosso padrão (Model Produto).
    """
    dados_brutos = service_off.buscar_produto_por_codigo(codigo_barras)
    
    if not dados_brutos:
        # Aqui, no futuro, poderíamos buscar no nosso Supabase antes de dar erro 404
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    # Usa a fábrica que criamos no models/produto.py
    produto_formatado = Produto.criar_do_openfoodfacts(dados_brutos)
    
    return produto_formatado