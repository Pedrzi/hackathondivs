from src.models.meals import Refeicao
from src.repositories.user_repository import UsuarioRepository
from src.repositories.meal_logs_repository import MealLogsRepository
from src.repositories.meal_plans_repository import MealPlansRepository
from typing import List
import math

class CalculadoraAderenciaService:
    """
    Calculadora de aderência que considera a densidade de erros recentes
    para ajustar a penalização de forma logarítmica.
    Stateless.
    """

    PESOS = {
        "calorias": 0.2,
        "proteinas": 0.2,
        "carbohidratos": 0.2,
        "lipidos": 0.2,
        "fibra": 0.2
    }

    def __init__(self, tolerancia: float = 0.05, janela_dias: int = 7):
        self.tolerancia = tolerancia
        self.janela_dias = janela_dias  # quantas refeições olhar para calcular densidade

    def _calcular_diferenca_percentual(self, planejado: float, real: float) -> float:
        """Evita divisão por zero e retorna diferença absoluta percentual"""
        if planejado == 0:
            return 0.0 if real == 0 else 1.0  # 100% de erro se planejado=0 e comeu algo
        return abs(planejado - real) / planejado

    def _densidade_erros(self, erros_anteriores: List[float]) -> float:
        """Calcula densidade de erros acima da tolerância nos últimos N dias"""
        if not erros_anteriores:
            return 0.0
        return sum(erros_anteriores) / len(erros_anteriores)

    def calcular_novo_score(self, userid, erros_anteriores=[]) -> float:
        """
        Calcula a nova aderência do usuário considerando:
        - erro da refeição atual
        - densidade de erros recentes (janela de N refeições)
        """

        meta = MealPlansRepository.buscar_usuario(userid)
        realizado = MealLogsRepository.buscar_usuario(userid)
        aderencia_atual = UsuarioRepository.buscar_usuario(userid)


        # 1. Calcular diferenças individuais da refeição atual
        erros = {
            "calorias": self._calcular_diferenca_percentual(meta.macros.calorias, realizado.macros.calorias),
            "proteinas": self._calcular_diferenca_percentual(meta.macros.proteinas, realizado.macros.proteinas),
            "carbohidratos": self._calcular_diferenca_percentual(meta.macros.carbohidratos, realizado.macros.carbohidratos),
            "lipidos": self._calcular_diferenca_percentual(meta.macros.lipidos, realizado.macros.lipidos),
            "fibra": self._calcular_diferenca_percentual(meta.macros.fibra, realizado.macros.fibra),
        }

        # 2. Erro ponderado da refeição de hoje
        erro_hoje = sum(erros[k] * self.PESOS[k] for k in erros)

        # 3. Média de erros históricos recentes
        media_erro_historico = sum(erros_anteriores) / len(erros_anteriores) if erros_anteriores else 0.0

        # 4. Densidade de erros recentes
        densidade = self._densidade_erros(erros_anteriores)

        # 5. Fator logarítmico baseado na densidade
        fator_densidade = 1 + math.log(densidade + 1)

        # 6. Penalização base + extra ponderada
        penalizacao_base = erro_hoje
        penalizacao_extra = 0.2 * erro_hoje * fator_densidade if erro_hoje > media_erro_historico else 0.0

        novo_score = aderencia_atual - (penalizacao_base + penalizacao_extra)

        # 7. Bonificação se erro hoje < média histórica
        if erro_hoje < media_erro_historico:
            novo_score += 0.1

        # 8. Atualizar lista de erros (para próxima chamada)
        if erros_anteriores is not None:
            if len(erros_anteriores) >= self.janela_dias:
                erros_anteriores.pop(0)
            erros_anteriores.append(erro_hoje)
        
        # 9. Restringido entre 0 e 10
        return max(0.0, min(10.0, novo_score))
