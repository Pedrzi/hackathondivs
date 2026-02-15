from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict

class UsuarioBase(BaseModel):
    """
    Campos comuns entre criação e leitura.
    Reflete os tipos do banco: int8 (BigInt), int4 (Integer), int2 (SmallInt).
    """

    name: Optional[str] = Field(default="Paciente sem nome", description="Nome do usuário")
    age: int = Field(..., description="Idade (bigint)")
    height: int = Field(..., description="Altura em cm (integer)")
    weight: int = Field(..., description="Peso em gramas (integer)")
    attention_score: int = Field(default=0, description="Classificação de atenção (smallint)")
    nutri_id: Optional[UUID] = Field(default=None, description="ID do nutricionista vinculado")
    pantry_id: Optional[UUID] = Field(default=None, description="ID da dispensa do usuário")

class UsuarioCreate(UsuarioBase):
    """
    Schema usado quando estamos CRIANDO um usuário (POST).
    O ID e created_at não são passados aqui pois o Supabase gera.
    """
    pass

class Usuario(UsuarioBase):
    """
    Representa um paciente/usuário no sistema.
    """
    id: UUID
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True, extra='ignore')