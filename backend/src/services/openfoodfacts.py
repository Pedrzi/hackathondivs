import requests
from typing import Optional, Dict, Any

class OpenFoodFactsService:
    """
    Serviço responsável por comunicar com a API pública do OpenFoodFacts.
    Documentação: https://openfoodfacts.github.io/api-documentation/
    """

    BASE_URL = "https://world.openfoodfacts.org/api/v2/product"

    def __init__(self):
        # É boa prática identificar o seu app no User-Agent
        self.headers = {
            "User-Agent": "Nutrium++App/1.0 (Student Project) - Android/iOS"
        }

    def buscar_produto_por_codigo(self, codigo_barras: str) -> Optional[Dict[str, Any]]:
        """
        Busca os dados brutos do produto.
        Retorna o dicionário 'product' se encontrado, ou None se não existir.
        """
        if not codigo_barras:
            return None

        url = f"{self.BASE_URL}/{codigo_barras}.json"

        try:
            print(f"🌍 A consultar OpenFoodFacts: {codigo_barras}...")
            
            # Timeout de 10s para não prender o servidor se a internet estiver lenta
            response = requests.get(url, headers=self.headers, timeout=10)
            
            if response.status_code == 404:
                print("❌ Produto não encontrado (404).")
                return None
            
            if response.status_code != 200:
                print(f"⚠️ Erro na API: Status {response.status_code}")
                return None

            data = response.json()

            # A API retorna status=1 se encontrou, status=0 se não encontrou
            if data.get("status") == 1:
                return data.get("product")
            else:
                print(f"❌ Status 0: Produto não existe na base.")
                return None

        except requests.exceptions.Timeout:
            print("â³ Timeout ao conectar com OpenFoodFacts.")
            return None
        except requests.exceptions.RequestException as e:
            print(f"🔥 Erro de conexão: {e}")
            return None