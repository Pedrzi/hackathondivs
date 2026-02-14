import sys
import os
import json
import time

# Adiciona o diretório raiz 'backend' ao path para importar 'src' corretamente
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from src.repositories.dispensa_repository import DispensaRepository
    from src.repositories.supabase_client import supabase
    # Novos imports para o funcionamento do scanner real
    from src.services.scanner_service import ScannerService
    from src.services.openfoodfacts_service import OpenFoodFactsService
    from src.models.produto import Produto
except ImportError as e:
    print(f"❌ Erro de importação: {e}")
    print("Certifique-se de executar este script da pasta raiz do projeto ou da pasta backend.")
    sys.exit(1)
except ValueError:
    print("⏩ Pulando teste (falta configuração .env)")
    sys.exit(0)

# --- DADOS MOCK (Simulando o Nutella.txt e API OpenFoodFacts) ---
MOCK_NUTELLA_API_DATA = {
    "code": "3017620422003",
    "product_name": "Nutella",
    "brands": "Ferrero",
    "product_quantity": 400, # Gramas
    "nutriments": {
        "energy-kcal_100g": 539,
        "proteins_100g": 6.3,
        "carbohydrates_100g": 57.5,
        "fat_100g": 30.9,
        "fiber_100g": 0,
        # Dados extras que devem ser ignorados pelo nosso parser
        "salt_100g": 0.107,
        "nova-group": 4
    },
    "image_url": "https://images.openfoodfacts.org/images/products/301/762/042/2003/front_fr.791.400.jpg"
}

def setup_usuario_teste():
    """Cria um usuário padrão para testes no Supabase."""
    user_id = "00000000-0000-0000-0000-000000000000"
    print(f"👤 Configurando usuário de teste: {user_id}")
    
    # 1. Garantir que o usuário existe
    supabase.table("users").upsert({
        "id": user_id, "age": 25, "height": 180, "weight": 80, "attention_score": 0
    }).execute()
    
    # 2. Garantir que a dispensa existe
    res = supabase.table("pantries").select("id").eq("user_id", user_id).execute()
    if not res.data:
        supabase.table("pantries").insert({"user_id": user_id}).execute()
    
    # 3. Limpar itens antigos da dispensa desse usuário para começar limpo
    pantry_id = res.data[0]['id'] if res.data else supabase.table("pantries").select("id").eq("user_id", user_id).execute().data[0]['id']
    supabase.table("pantry_items").delete().eq("pantry_id", pantry_id).execute()
    
    return user_id

def preparar_produto_para_db(api_data):
    """
    Simula a lógica do Backend que transforma o JSON da API 
    no formato exato da sua tabela 'products'.
    """
    nutri = api_data.get("nutriments", {})
    
    return {
        "id": api_data.get("code") or api_data.get("_id"), # Primary Key
        "name": api_data.get("product_name"),
        "brand": api_data.get("brands", "Genérico"),
        "weight": float(api_data.get("product_quantity", 0)),
        "image": api_data.get("image_url"),
        "nutri_info": {                   # JSONB
            "calorias": float(nutri.get("energy-kcal_100g", 0)),
            "proteinas": float(nutri.get("proteins_100g", 0)),
            "carbohidratos": float(nutri.get("carbohydrates_100g", 0)),
            "lipidos": float(nutri.get("fat_100g", 0)),
            "fibra": float(nutri.get("fiber_100g", 0))
        }
    }

def teste_ciclo_completo_scanner():
    print("\n🚀 INICIANDO TESTE MOCK: DADOS FIXOS DA NUTELLA")
    
    repo = DispensaRepository()
    user_id = setup_usuario_teste()
    
    # --- PASSO 1: Simular Escaneamento e Busca na API ---
    codigo_escaneado = MOCK_NUTELLA_API_DATA["code"]
    print(f"\n📲 1. Código Escaneado (Mock): {codigo_escaneado}")

    # --- PASSO 2: Salvar no Catálogo Global ---
    print("\n💾 2. Salvando dados do produto na tabela 'products'...")
    produto_db = preparar_produto_para_db(MOCK_NUTELLA_API_DATA)
    supabase.table("products").upsert(produto_db).execute()
    print(f"   ✅ Produto salvo/atualizado: {produto_db['name']}")

    # --- PASSO 3: Adicionar à Dispensa ---
    print("\n🏠 3. Adicionando item à dispensa do usuário...")
    repo.adicionar_item(user_id, codigo_escaneado, quantidade=1)
    
    # --- PASSO 4: Validação ---
    validar_dispensa(repo, user_id, codigo_escaneado)

def teste_com_scanner_real():
    print("\n📸 INICIANDO TESTE REAL: CAMERA + API EXTERNA")
    
    scanner = ScannerService()
    off_service = OpenFoodFactsService()
    repo = DispensaRepository()
    user_id = setup_usuario_teste()

    # 1. Escanear
    print("   👉 Aponte a câmera para um código de barras...")
    codigo = scanner.escanear_codigo_localmente()
    
    if not codigo:
        print("   ⚠️ Nenhum código detectado ou tempo esgotado.")
        return

    print(f"   📲 Código Detectado: {codigo}")

    # 2. Buscar Dados Reais
    print("   🌍 Consultando OpenFoodFacts...")
    dados_api = off_service.buscar_produto_por_codigo(codigo)
    
    if not dados_api:
        print("   ❌ Produto não encontrado na base de dados externa (OpenFoodFacts).")
        return

    print(f"   ✅ Produto Encontrado: {dados_api.get('product_name', 'Sem Nome')}")

    # 3. Salvar no Banco
    print("   💾 Salvando no catálogo global...")
    produto_db = preparar_produto_para_db(dados_api)
    supabase.table("products").upsert(produto_db).execute()

    # 4. Adicionar à Dispensa
    print("   🏠 Adicionando à dispensa...")
    repo.adicionar_item(user_id, codigo, quantidade=1)

    # 5. Validar
    validar_dispensa(repo, user_id, codigo)

def validar_dispensa(repo, user_id, codigo_esperado):
    print("\n🔍 Verificando se o item está na dispensa...")
    itens = repo.listar_itens_do_usuario(user_id)
    
    item_encontrado = next((i for i in itens if i.produto.id_codigo_barras == codigo_esperado), None)

    if item_encontrado:
        print(f"   🎉 SUCESSO! Item recuperado do banco:")
        print(f"      - Nome: {item_encontrado.produto.nome}")
        print(f"      - Quantidade: {item_encontrado.quantidade_unidades}")
    else:
        print("   ❌ FALHA: Item não encontrado na dispensa.")

if __name__ == "__main__":
    print("=========================================")
    print("   TESTE DE INTEGRAÇÃO - DISPENSA APP    ")
    print("=========================================")
    print("1 - Teste Rápido (Mock Nutella - Sem câmera)")
    print("2 - Teste Completo (Usar Câmera Real)")
    
    opcao = input("\nEscolha uma opção (1 ou 2): ")
    
    if opcao == '2':
        teste_com_scanner_real()
    else:
        teste_ciclo_completo_scanner()