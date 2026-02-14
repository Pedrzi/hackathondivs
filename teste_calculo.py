import unittest

# --- CÓDIGO ORIGINAL (Para contexto do teste) ---
peso_calorias = 0.2
peso_proteinas = 0.2
peso_carbohidratos = 0.2
peso_lipidos = 0.2
peso_fibra = 0.2

class Refeicao:
    def __init__(self, calorias, proteinas, carbohidratos, lipidos, fibra):
        self.calorias = calorias
        self.proteinas = proteinas
        self.carbohidratos = carbohidratos
        self.lipidos = lipidos
        self.fibra = fibra

class PlanoAlimentar:
    def __init__(self, aderencia_inicial=10, tolerancia=0.05):
        self.aderencia = aderencia_inicial
        self.tolerancia = tolerancia

    def calcula_risco(self, refeicao_plano: Refeicao, refeicao_real: Refeicao, diferenca_ontem, diferenca_anteontem):
        # Proteção contra divisão por zero adicionada na lógica original via ternário
        dif_cal = abs(refeicao_plano.calorias - refeicao_real.calorias) / refeicao_plano.calorias if refeicao_plano.calorias != 0 else 0
        dif_prot = abs(refeicao_plano.proteinas - refeicao_real.proteinas) / refeicao_plano.proteinas if refeicao_plano.proteinas != 0 else 0
        dif_carb = abs(refeicao_plano.carbohidratos - refeicao_real.carbohidratos) / refeicao_plano.carbohidratos if refeicao_plano.carbohidratos != 0 else 0
        dif_lip = abs(refeicao_plano.lipidos - refeicao_real.lipidos) / refeicao_plano.lipidos if refeicao_plano.lipidos != 0 else 0
        dif_fib = abs(refeicao_plano.fibra - refeicao_real.fibra) / refeicao_plano.fibra if refeicao_plano.fibra != 0 else 0

        diferenca_hoje = (dif_cal * peso_calorias
                     + dif_prot * peso_proteinas
                     + dif_carb * peso_carbohidratos
                     + dif_lip * peso_lipidos
                     + dif_fib * peso_fibra)
        
        tendencia = (diferenca_anteontem + diferenca_ontem) / 2

        if diferenca_hoje > self.tolerancia:
            # penalizacao extra se estiver a piorar (diferença maior que a tendência)
            if diferenca_hoje > tendencia:
                self.aderencia -= diferenca_hoje * 1.2
            else:
                self.aderencia -= diferenca_hoje
        else:
            # Bonificação se estiver melhorando
            if diferenca_hoje < tendencia:
                self.aderencia += 0.1

        # Clamp (manter entre 0 e 10)
        self.aderencia = max(0, min(10, self.aderencia))

        return self.aderencia

# --- SUÍTE DE TESTES ---

class TestPlanoAlimentar(unittest.TestCase):

    def setUp(self):
        # Configuração inicial antes de cada teste
        # Refeição base: 500kcal, 30g prot, 50g carb, 20g fat, 10g fibra
        self.plano_base = Refeicao(500, 30, 50, 20, 10)
        self.plano = PlanoAlimentar(aderencia_inicial=10.0, tolerancia=0.05)

    def test_refeicao_perfeita_mantem_nota_maxima(self):
        """Teste 1: Se a refeição for idêntica, a nota deve se manter 10."""
        real = Refeicao(500, 30, 50, 20, 10) # Idêntico
        
        # Tendencia passada foi de 0 erro
        nova_aderencia = self.plano.calcula_risco(self.plano_base, real, 0, 0)
        
        self.assertEqual(nova_aderencia, 10)

    def test_penalizacao_agravada_piora_habito(self):
        """Teste 2: Erro alto hoje (> tolerância) e maior que a média anterior (Piora)."""
        # Plano: 500kcal. Real: 750kcal (50% erro). 
        # Erro ponderado: 0.5 * 0.2 (peso) = 0.1 de diferença total (os outros nutrientes estão iguais)
        real = Refeicao(750, 30, 50, 20, 10) 
        
        # Tendência anterior era muito boa (0.01), então hoje (0.1) é uma piora
        # Cálculo esperado: 10 - (0.1 * 1.2) = 9.88
        nova_aderencia = self.plano.calcula_risco(self.plano_base, real, 0.01, 0.01)
        
        self.assertAlmostEqual(nova_aderencia, 9.88, places=2)

    def test_penalizacao_padrao_melhora_habito_mas_fora_meta(self):
        """Teste 3: Erro alto hoje (> tolerância), mas menor que a média anterior (Melhora relativa)."""
        # Erro de 0.1 (calculado acima)
        real = Refeicao(750, 30, 50, 20, 10)
        
        # Tendência anterior era péssima (0.2), então hoje (0.1) é uma 'melhora', mas ainda > tolerância (0.05)
        # Cálculo esperado: 10 - 0.1 = 9.9
        nova_aderencia = self.plano.calcula_risco(self.plano_base, real, 0.2, 0.2)
        
        self.assertAlmostEqual(nova_aderencia, 9.9, places=2)

    def test_bonificacao_dentro_tolerancia(self):
        """Teste 4: Erro pequeno (< tolerância) e melhor que a tendência (Bônus)."""
        # Erro minúsculo nas calorias (505 vs 500). Diferença ~1%. 
        # Ponderado: 0.01 * 0.2 = 0.002.
        # 0.002 < 0.05 (Tolerância) E 0.002 < 0.05 (Tendência passada) -> Ganha 0.1
        self.plano.aderencia = 9.0 # Começa com 9 para poder subir
        real = Refeicao(505, 30, 50, 20, 10)
        
        nova_aderencia = self.plano.calcula_risco(self.plano_base, real, 0.05, 0.05)
        
        self.assertEqual(nova_aderencia, 9.1)

    def test_limite_minimo_zero(self):
        """Teste 5: A nota não pode ser negativa."""
        self.plano.aderencia = 0.1 # Nota muito baixa
        
        # Refeição desastrosa (Erro 100% em tudo -> Diferença ponderada = 1.0)
        real = Refeicao(1000, 60, 100, 40, 20) 
        
        # Vai penalizar: 0.1 - (1.0 * 1.2) = -1.1. Deve travar em 0.
        nova_aderencia = self.plano.calcula_risco(self.plano_base, real, 0, 0)
        
        self.assertEqual(nova_aderencia, 0)

    def test_limite_maximo_dez(self):
        """Teste 6: A nota não pode passar de 10."""
        self.plano.aderencia = 9.95
        real = Refeicao(500, 30, 50, 20, 10) # Perfeita
        
        # Deveria ganhar 0.1 (se a tendencia fosse ruim), indo para 10.05. Deve travar em 10.
        nova_aderencia = self.plano.calcula_risco(self.plano_base, real, 0.1, 0.1)
        
        self.assertEqual(nova_aderencia, 10)

    def test_divisao_por_zero(self):
        """Teste 7: O plano tem valores zero (ex: jejum ou dieta zero carbo)."""
        plano_jejum = Refeicao(0, 0, 0, 0, 0)
        real_quebra_jejum = Refeicao(200, 10, 10, 10, 0)
        
        # Não deve lançar exceção ZeroDivisionError
        try:
            nova_aderencia = self.plano.calcula_risco(plano_jejum, real_quebra_jejum, 0, 0)
        except ZeroDivisionError:
            self.fail("calcula_risco lançou ZeroDivisionError incorretamente.")

if __name__ == '__main__':
    unittest.main(argv=['first-arg-is-ignored'], exit=False)