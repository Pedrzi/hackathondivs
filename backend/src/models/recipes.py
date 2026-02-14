from pydantic import BaseModel, Field
from .products import Produto
from .meals import Macros

class Ingrediente(BaseModel, self):
     # Recebe já o nome do produto 
     name : str 
     # quantidade em gramas usada para a receita 
     quantidade : float = Field(...,ge = 0, le= 200)
     calorias : float 


     def calculate_calorias(cls,self, name):
        ... #Precisa procurar o produto na dispensa pela ""nome""" 
            #supondo que já temos o 
        produto: Produto
        info_nutri = produto.info_nutricional
        # As calorias totais corresponde as calorias que temos no produto que é sempre kcal/100g
        calorias_total : float = info_nutri.calorias 
        caloria_ingr : float = self.quantidade * (calorias_total/ 100) 
        self.calorias = caloria_ingr


class Ingredientes (BaseModel):
    lista_ingredientes = list[Ingrediente]
          


class Recipe(BaseModel):
    # Uma string que será recolhida pelo bot 
    modo_de_preparo : str
    #Classe de Ingredientes 
    ingredientes = Ingredientes 
    tempo_de_preparo : int


class Recipes(BaseModel):
    ...
