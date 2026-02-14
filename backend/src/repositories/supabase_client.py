import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env (procura na raiz do projeto ou pasta atual)
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Validação de segurança para não tentar conectar com valores nulos
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError(
        "❌ Erro Crítico: As variáveis SUPABASE_URL e SUPABASE_KEY não foram encontradas. "
        "Certifique-se de criar um arquivo '.env' na pasta backend com essas chaves."
    )

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)