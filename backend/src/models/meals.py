from pydantic import BaseModel, Field
from .products import Produto
from .recipes import Recipe

class Macros(BaseModel):
    calorias: float = Field(default=0, description="Kcal totais")
    proteinas: float = Field(default=0, description="Gramas")
    carbohidratos: float = Field(default=0, description="Gramas")
    lipidos: float = Field(default=0, description="Gramas")
    fibra: float = Field(default=0, description="Gramas")

class Refeicao(BaseModel):
    """Representa tanto uma refeição planejada quanto uma realizada"""
    nome: str = Field(..., description="Ex: Almoço, Jantar")
    alimentos: list[Produto|Recipe] = [] # Lista de receita + produtos a parte 
    macros: Macros ## SOMA das calorias de todos as coisas consumidas 