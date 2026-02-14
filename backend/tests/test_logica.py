import unittest
import sys
import os

# Adiciona o diretório raiz 'backend' ao path para importar 'src'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from src.services.calc import CalculadoraAderenciaService
from src.models.meals import Refeicao, Macros
from src.models.products import Produto

class TestCalculadoraAderencia(unittest.TestCase):
    def setUp(self):
        self.calculadora = CalculadoraAderenciaService(tolerancia=0.05)
        
        # Meta: 500kcal equilibradas
        self.meta = Refeicao(
            nome="Almoço Meta",
            macros=Macros(calorias=500, proteinas=30, carbohidratos=50, lipidos=20, fibra=10)
        )

    def test_refeicao_perfeita(self):
        """Se comer exatamente a meta, mantém a nota (ou sobe se a média anterior for ruim)"""
        realizado = Refeicao(nome="Almoço Real", macros=self.meta.macros)
        
        # Média de erro anterior era 0 (perfeição), aderência 10
        nova_nota = self.calculadora.calcular_novo_score(
            meta=self.meta, realizado=realizado, aderencia_atual=10.0, media_erro_dias_anteriores=0.0
        )
        self.assertEqual(nova_nota, 10.0)

    def test_penalizacao_exagerada(self):
        """Se comer 50% a mais, deve baixar a nota"""
        macros_exagero = Macros(calorias=750, proteinas=30, carbohidratos=50, lipidos=20, fibra=10)
        realizado = Refeicao(nome="Exagero", macros=macros_exagero)
        
        # Erro de 50% nas calorias * peso 0.2 = 0.1 de erro total
        # Tolerância é 0.05, então pune.
        nova_nota = self.calculadora.calcular_novo_score(
            meta=self.meta, realizado=realizado, aderencia_atual=9.0, media_erro_dias_anteriores=0.0
        )
        self.assertTrue(nova_nota < 9.0, "A nota deveria ter baixado")

class TestProdutoParser(unittest.TestCase):
    def test_parser_openfoodfacts_nutella(self):
        """Testa se o JSON complexo da API vira um objeto Produto limpo"""
        
        # Simula o JSON sujo que vem da API (baseado no nutella.txt)
        fake_api_json = {
            "code": "3017620422003",
            "product_name": "Nutella Teste",
            "brands": "Ferrero",
            "product_quantity": "400",
            "nutriments": {
                "energy-kcal_100g": 539,
                "proteins_100g": 6.3,
                "carbohydrates_100g": 57.5,
                "fat_100g": 30.9,
                "fiber_100g": 0,
                # Campos extras que devem ser ignorados
                "salt_100g": 0.107, 
                "nova-group": 4
            }
        }

        produto = Produto.criar_do_openfoodfacts(fake_api_json)

        self.assertEqual(produto.nome, "Nutella Teste")
        self.assertEqual(produto.quantidade_embalagem_g, 400.0)
        self.assertEqual(produto.info_nutricional.calorias, 539.0)
        self.assertEqual(produto.info_nutricional.proteinas, 6.3)
        # Verifica se lidou com campo float string ou int
        self.assertIsInstance(produto.quantidade_embalagem_g, float)

if __name__ == '__main__':
    unittest.main()