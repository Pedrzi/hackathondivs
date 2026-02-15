from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from .meals import Macros

class Produto(BaseModel):
    id_codigo_barras: str
    nome: str
    marca: str = "Desconhecida"
    quantidade_embalagem_g: float = 0
    imagem_url: Optional[str] = None
    
    # Informação nutricional padronizada (por 100g ou porção)
    info_nutricional: Macros
    dados_brutos: Optional[Dict[str, Any]] = Field(default=None, exclude=True)

    @classmethod
    def criar_do_openfoodfacts(cls, dados: Dict[str, Any] | List[Dict[str, Any]]):
        """
        Cria Produto(s) a partir de dados do OpenFoodFacts.
        Retorna:
        - Produto único se input for dict
        - Lista[Produto] se input for List[dict]
        """
        # Converte dict único para lista temporária
        lista = [dados] if isinstance(dados, dict) else dados
        produtos = []

        for item in lista:
            nutrientes = item.get('nutriments', {})
            macros = Macros(
                calorias=float(nutrientes.get('energy-kcal_100g', 0)),
                proteinas=float(nutrientes.get('proteins_100g', 0)),
                carbohidratos=float(nutrientes.get('carbohydrates_100g', 0)),
                lipidos=float(nutrientes.get('fat_100g', 0)),
                fibra=float(nutrientes.get('fiber_100g', 0))
            )

            produto = cls(
                id_codigo_barras=item.get('_id') or item.get('code', 'sem-id'),
                nome=item.get('product_name', 'Produto Sem Nome'),
                marca=item.get('brands', 'Genérico'),
                quantidade_embalagem_g=float(item.get('product_quantity', 0)),
                imagem_url=dados.get('image_url'),
            info_nutricional=macros,
                dados_brutos=item
            )
            produtos.append(produto)

        # Se input original era dict, retorna o primeiro Produto
        return produtos[0] if isinstance(dados, dict) else produtos

class ItemDispensa(BaseModel):
    """Item na tabela 'pantrys' do Supabase"""
    produto: Produto
    quantidade_unidades: int = Field(default=1, description="Número de potes/pacotes")