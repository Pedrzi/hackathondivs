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

    def calcula_aderencia(self, refeicao_plano: Refeicao, refeicao_real: Refeicao, diferenca_ontem, diferenca_anteontem):
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

        # penaliza quando excede a tolerancia
        if diferenca_hoje > self.tolerancia:
            # penalizacao extra se estiver a piorar
            if diferenca_hoje > tendencia:
                self.aderencia -= diferenca_hoje * 1.2
            else:
                self.aderencia -= diferenca_hoje
        else:
            if diferenca_hoje < tendencia:
                self.aderencia += 0.1

        self.aderencia = max(0, min(10, self.aderencia))

        return self.aderencia

    def ordena_lista_refeicoes(self, lista_refeicoes, refeicao_padrao):
        lista_refeicoes_ordenada = []

        for refeicao in lista_refeicoes:
            lista_refeicoes_ordenada.append((refeicao.calcula_aderencia(refeicao_padrao), refeicao))
        
        lista_refeicoes_ordenada.sort(reverse=True)
        
        return lista_refeicoes_ordenada

