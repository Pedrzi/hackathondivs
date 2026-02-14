from pydantic import BaseModel, Field

class Macros(BaseModel):
    calorias: float = Field(default=0, description="Kcal totais")
    proteinas: float = Field(default=0, description="Gramas")
    carbohidratos: float = Field(default=0, description="Gramas")
    lipidos: float = Field(default=0, description="Gramas")
    fibra: float = Field(default=0, description="Gramas")

class Refeicao(BaseModel):
    """Representa tanto uma refeição planejada quanto uma realizada"""
    nome: str = Field(..., description="Ex: Almoço, Jantar")
    alimentos: list[str] = [] 
    macros: Macros