from src.models.meals import Refeicao

class CalculadoraAderenciaService:
    """
    Serviço responsável por calcular o impacto de uma refeição na nota do usuário.
    Stateless: Não guarda estado, apenas processa.
    """
    
    PESOS = {
        "calorias": 0.2,
        "proteinas": 0.2,
        "carbohidratos": 0.2,
        "lipidos": 0.2,
        "fibra": 0.2
    }

    def __init__(self, tolerancia: float = 0.05):
        self.tolerancia = tolerancia

    def _calcular_diferenca_percentual(self, planejado: float, real: float) -> float:
        """Evita divisão por zero e retorna diferença absoluta %"""
        if planejado == 0:
            return 0.0 if real == 0 else 1.0 # 100% de erro se planejado 0 e comeu algo
        return abs(planejado - real) / planejado

    def calcular_novo_score(self, 
                            meta: Refeicao, 
                            realizado: Refeicao, 
                            aderencia_atual: float,
                            media_erro_dias_anteriores: float) -> float:
        
        # 1. Calcular diferenças individuais
        erros = {
            "calorias": self._calcular_diferenca_percentual(meta.macros.calorias, realizado.macros.calorias),
            "proteinas": self._calcular_diferenca_percentual(meta.macros.proteinas, realizado.macros.proteinas),
            "carbohidratos": self._calcular_diferenca_percentual(meta.macros.carbohidratos, realizado.macros.carbohidratos),
            "lipidos": self._calcular_diferenca_percentual(meta.macros.lipidos, realizado.macros.lipidos),
            "fibra": self._calcular_diferenca_percentual(meta.macros.fibra, realizado.macros.fibra),
        }

        # 2. Calcular erro ponderado de hoje
        erro_hoje = sum(erros[k] * self.PESOS[k] for k in erros)
        
        # 3. Lógica de punição/recompensa
        novo_score = aderencia_atual
        
        if erro_hoje > self.tolerancia:
            # Penalização
            fator_punicao = 1.2 if erro_hoje > media_erro_dias_anteriores else 1.0
            novo_score -= (erro_hoje * fator_punicao)
        else:
            # Bonificação (se estiver melhor que a média histórica)
            if erro_hoje < media_erro_dias_anteriores:
                novo_score += 0.1

        # 4. Clamp (travar entre 0 e 10)
        return max(0.0, min(10.0, novo_score))