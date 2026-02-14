from pydantic import BaseModel, Field, ConfigDict, Dict
from functools import reduce
from .products import Produto
from .meals import Macros
from services.openfoodfacts import procura_produto_por_nome 

class Ingrediente(BaseModel, self):
     # Recebe já o nome do produto 
     name : str 
     # quantidade em gramas usada para a receita 
     quantidade : float = Field(...,ge = 0, le= 200)
     # preciso alterar isso para informações nutricionais
     calorias : float 
    
    
     model_config = ConfigDict(frozen=True)


class Ingredientes (BaseModel):
    ingredientes = Dict[Ingrediente, Macros]
          


class Recipe(BaseModel):
    # Uma string que será recolhida pelo bot 
    modo_de_preparo : str
    #Define um dicionário, key: Um Objeto da classe Ingrediente, value: quantidade em gramas preciso para a receita
    ingredientes = Ingredientes
    macroTotal = reduce(lambda x, y: x + y, ingredientes.values(), Macros()) 
    tempo_de_preparo : int = 0


