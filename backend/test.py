import sys
import os
import time

# Adiciona o diretório atual ao path para conseguir importar 'src'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.services.openfoodfacts import OpenFoodFactsService
from src.services.calc import CalculadoraAderenciaService
from src.services.scanner import ScannerService
from src.models.products import Produto
from src.models.meals import Refeicao, Macros

def imprimir_titulo(titulo):
    print(f"\n{'='*50}")
    print(f"🛠️  TESTE: {titulo}")
    print(f"{'='*50}")

def teste_completo():
    # --- 1. TESTE DO SCANNER ---
    imprimir_titulo("1. SCANNER E CÂMARA")
    scanner = ScannerService()
    
    resposta = input("Queres abrir a câmara para testar? (s/n): ").lower()
    codigo_barras = "3017620422003" # Código da Nutella por defeito

    if resposta == 's':
        print("📷 A abrir câmara... aponta para um código de barras (ex: Nutella, Cola).")
        codigo_lido = scanner.escanear_codigo_localmente()
        if codigo_lido:
            print(f"✅ Sucesso! Código lido: {codigo_lido}")
            codigo_barras = codigo_lido
        else:
            print("❌ Nenhum código lido (Timeout). A usar código de teste.")
    else:
        print(f"⏩ A saltar câmara. A usar código da Nutella: {codigo_barras}")

    # --- 2. TESTE DO OPEN FOOD FACTS ---
    imprimir_titulo("2. INTEGRAÇÃO API OPEN FOOD FACTS")
    off_service = OpenFoodFactsService()
    
    dados_brutos = off_service.buscar_produto_por_codigo(codigo_barras)
    
    if dados_brutos:
        produto = Produto.criar_do_openfoodfacts(dados_brutos)
        print(f"✅ Produto Encontrado: {produto.nome}")
        print(f"   Marca: {produto.marca}")
        print(f"   Peso Embalagem: {produto.quantidade_embalagem_g}g")
        print(f"   Calorias (100g): {produto.info_nutricional.calorias} kcal")
        print(f"   Proteínas (100g): {produto.info_nutricional.proteinas} g")
    else:
        print("❌ Erro: Produto não encontrado na API externa.")
        return # Para o teste se falhar aqui

    # --- 3. TESTE DA CALCULADORA DE ADERÊNCIA ---
    imprimir_titulo("3. CÁLCULO DE ADERÊNCIA (DIETA)")
    
    # Cenário: O Nutricionista mandou comer algo leve, mas tu comeste 100g desse produto
    meta_do_nutricionista = Refeicao(
        nome="Lanche da Tarde",
        macros=Macros(calorias=200, proteinas=10, carbohidratos=20, lipidos=5, fibra=5)
    )

    # O que realmente comeste (100g do produto scaneado)
    refeicao_realizada = Refeicao(
        nome="O que comi",
        macros=produto.info_nutricional # Usa os macros do produto direto (assumindo 100g)
    )

    print(f"📋 Meta: {meta_do_nutricionista.macros.calorias} kcal")
    print(f"🍔 Real: {refeicao_realizada.macros.calorias} kcal (Baseado no produto)")

    calculadora = CalculadoraAderenciaService()
    
    # Simula que a tua nota atual é 9.0 e a média de erro anterior era 10% (0.10)
    aderencia_inicial = 9.0
    nova_nota = calculadora.calcular_novo_score(
        meta=meta_do_nutricionista,
        realizado=refeicao_realizada,
        aderencia_atual=aderencia_inicial,
        media_erro_dias_anteriores=0.10
    )

    print(f"\n📊 Nota Anterior: {aderencia_inicial}")
    print(f"📉 Nova Nota: {nova_nota:.2f}")

    if nova_nota < aderencia_inicial:
        print("⚠️ Resultado: A nota baixou (O produto era muito calórico para a meta!)")
    else:
        print("🎉 Resultado: A nota subiu ou manteve-se!")

if __name__ == "__main__":
    try:
        teste_completo()
        print("\n✅ TODOS OS SISTEMAS OPERACIONAIS.")
    except Exception as e:
        print(f"\n❌ ERRO CRÍTICO NO SISTEMA: {e}")