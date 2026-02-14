from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from .meals import Macros

class Produto(BaseModel):
    id_codigo_barras: str
    nome: str
    marca: str = "Desconhecida"
    quantidade_embalagem_g: float = 0
    
    # Informação nutricional padronizada (por 100g ou porção)
    info_nutricional: Macros
    
    # Dados brutos para debug/expansão futura
    dados_brutos: Optional[Dict[str, Any]] = Field(default=None, exclude=True)

    @classmethod
    def criar_do_openfoodfacts(cls, dados: Dict[str, Any]):
        """Factory method para limpar os dados da API externa"""
        nutrientes = dados.get('nutriments', {})
        
        macros = Macros(
            calorias=float(nutrientes.get('energy-kcal_100g', 0)),
            proteinas=float(nutrientes.get('proteins_100g', 0)),
            carbohidratos=float(nutrientes.get('carbohydrates_100g', 0)),
            lipidos=float(nutrientes.get('fat_100g', 0)),
            fibra=float(nutrientes.get('fiber_100g', 0))
        )

        return cls(
            id_codigo_barras=dados.get('_id') or dados.get('code', 'sem-id'),
            nome=dados.get('product_name', 'Produto Sem Nome'),
            marca=dados.get('brands', 'Genérico'),
            quantidade_embalagem_g=float(dados.get('product_quantity', 0)),
            info_nutricional=macros,
            dados_brutos=dados
        )

class ItemDispensa(BaseModel):
    """Item na tabela 'pantrys' do Supabase"""
    produto: Produto
    quantidade_unidades: int = Field(default=1, description="Número de potes/pacotes")