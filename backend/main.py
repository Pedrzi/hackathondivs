from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from src.services.scanner import ScannerService
from src.services.calc import CalculadoraAderenciaService
from src.services.openfoodfacts import OpenFoodFactsService # (Implementação simples abaixo)
from src.models.meals import Refeicao
from src.models.products import Produto

app = FastAPI(title="Nutrium++ Backend", version="1.0.0")

# Instância dos serviços (Em apps maiores, usamos injeção de dependência)
scanner_service = ScannerService()
calculadora_service = CalculadoraAderenciaService()
off_service = OpenFoodFactsService()

# --- DTOs (Data Transfer Objects) para as rotas ---
class RequestCalculoAderencia(BaseModel):
    meta: Refeicao
    realizado: Refeicao
    aderencia_atual: float
    media_erro_historico: float

# --- Rotas ---

@app.get("/api/scan-teste-backend")
def rota_escanear_codigo():
    """
    Abre a câmera do servidor para testes.
    Retorna o código de barras encontrado.
    """
    codigo = scanner_service.escanear_codigo_localmente()
    if not codigo:
        raise HTTPException(status_code=404, detail="Nenhum código detectado ou timeout.")
    
    # Busca dados no OFF
    produto_dados = off_service.buscar_produto(codigo)
    produto = Produto.criar_do_openfoodfacts(produto_dados)
    
    return {"mensagem": "Sucesso", "produto": produto}

@app.post("/api/calcular-aderencia")
def rota_calcular_aderencia(dados: RequestCalculoAderencia):
    """
    Calcula a nova nota de aderência baseada na refeição enviada.
    """
    novo_score = calculadora_service.calcular_novo_score(
        meta=dados.meta,
        realizado=dados.realizado,
        aderencia_atual=dados.aderencia_atual,
        media_erro_dias_anteriores=dados.media_erro_historico
    )
    
    return {
        "aderencia_anterior": dados.aderencia_atual,
        "nova_aderencia": round(novo_score, 2),
        "status": "Aprovado" if novo_score >= dados.aderencia_atual else "Atenção"
    }

if __name__ == "__main__":
    import uvicorn
    # Roda o servidor na porta 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)