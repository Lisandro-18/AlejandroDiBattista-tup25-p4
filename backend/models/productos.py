from typing import Optional
from sqlmodel import SQLModel, Field


class Producto(SQLModel, table=True):
    """Modelo de Producto basado en productos.json"""

    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str = Field(max_length=255)
    precio: float = Field(default=0.0, ge=0)
    descripcion: str = Field(default="")
    categoria: str = Field(default="", max_length=100)
    valoracion: float = Field(default=0.0, ge=0, le=5)
    existencia: int = Field(default=0, ge=0)
    imagen: str = Field(default="")
