from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class Compra(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="user.id")
    fecha: datetime = Field(default_factory=datetime.utcnow)
    total: float = Field(default=0.0, ge=0)
    direccion_envio: Optional[str] = Field(default=None)

class CompraItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    compra_id: int = Field(foreign_key="compra.id")
    producto_id: int = Field(foreign_key="producto.id")
    cantidad: int = Field(default=1, ge=1)
    precio_unitario: float = Field(default=0.0, ge=0)
