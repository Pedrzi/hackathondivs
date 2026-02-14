from pydantic import BaseModel, Field, ConfigDict, isinstance, reduce
from .products import Produto
from .recipes import Recipe

class Macros(BaseModel):
    calorias: float = Field(default=0, description="Kcal totais")
    proteinas: float = Field(default=0, description="Gramas")
    carbohidratos: float = Field(default=0, description="Gramas")
    lipidos: float = Field(default=0, description="Gramas")
    fibra: float = Field(default=0, description="Gramas")

    def __add__(self, other: Macros, BaseModel ) -> Macros:
        if not isinstance(other, Macros):
            return NotImplemented
        
        return Macros(
            calorias=self.calorias + other.calorias,
            proteinas=self.proteinas + other.proteinas,
            carbohidratos=self.carbohidratos + other.carbohidratos,
            lipidos=self.lipidos + other.lipidos,
            fibra=self.fibra + other.fibra
        )
    
model_config = ConfigDict(frozen=True)



class Refeicao(BaseModel):
    """Representa tanto uma refeição planejada quanto uma realizada"""
    nome: str = Field(..., description="Ex: Almoço, Jantar")
    alimentos: list[Produto|Recipe] = [] # Lista de receita + produtos a parte 
    
   
 
    def extrai_macro(self, item):
        if isinstance(Produto):
             macro = item.info_nutricional
             return macro
        elif isinstance(Recipe):
             macro = item.macro_total
             return macro
        else:
             return None
        
    @property
    def macros_totais(self) -> Macros:
        lista_macros = [self.extrai_macro(x) for x in self.alimentos]
    # Filtra os Nones e soma usando __add__
        return reduce(lambda x, y: x + y, filter(None, lista_macros), Macros())
     
    macros: Macros = macros_totais() ## SOMA das calorias de todos as coisas consumidas 
        
         