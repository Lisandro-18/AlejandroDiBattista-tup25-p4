# main.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import SQLModel, Session, create_engine, select
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel
from jose import JWTError, jwt
import os, json


from models.usuarios import User
from models.compras import Compra, CompraItem

# ========== CONFIG ==========
SECRET_KEY = "cambia-esta-clave-por-una-secreta-muy-larga"  
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DATABASE_URL = "sqlite:///database.db"
engine = create_engine(DATABASE_URL, echo=False)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

IMAGES_DIR = os.path.join(os.path.dirname(__file__), "imagenes")
if os.path.isdir(IMAGES_DIR):
    app.mount("/imagenes", StaticFiles(directory=IMAGES_DIR), name="imagenes")



class RegisterIn(BaseModel):
    name: str
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class LoginIn(BaseModel):
    email: str
    password: str


class CompraIn(BaseModel):
    usuario_id: int
    direccion_envio: Optional[str] = None
    items: list



def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()



def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(token: str = Depends(lambda: None)):
    """
    Este helper se deja simple — en endpoints protegidos usaremos verificación manual.
    (En FastAPI real conviene usar OAuth2PasswordBearer + Depends)
    """
    raise NotImplementedError("Usar funciones específicas en endpoints protegidos.")



@app.get("/")
def home():
    return {"message": "Backend Ecommerce TP6 - funcionando 🚀"}


@app.get("/productos")
def obtener_productos():
    ruta = os.path.join(os.path.dirname(__file__), "productos.json")
    with open(ruta, "r", encoding="utf-8") as f:
        productos = json.load(f)
    for p in productos:
        p["imagen"] = f"http://127.0.0.1:8000/imagenes/{p['imagen']}"
    return productos


@app.post("/auth/register", response_model=dict)
def register(payload: RegisterIn):
    with Session(engine) as session:
        existe = session.exec(select(User).where(User.email == payload.email)).first()
        if existe:
            raise HTTPException(status_code=400, detail="El correo ya está registrado.")
        user = User(name=payload.name, email=payload.email, hashed_password=get_password_hash(payload.password))
        session.add(user)
        session.commit()
        session.refresh(user)
        return {"message": "Usuario registrado correctamente", "user_id": user.id}


@app.post("/auth/login", response_model=Token)
def login(payload: LoginIn):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == payload.email)).first()
        if not user or not verify_password(payload.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Credenciales inválidas.")
        token = create_access_token({"sub": str(user.id), "name": user.name, "email": user.email})
        return {"access_token": token, "token_type": "bearer"}



# Endpoints protegidos 

from fastapi import Header

def get_user_from_token(authorization: Optional[str] = Header(None)):
    """
    Cabecera esperada: Authorization: Bearer <token>
    Retorna el user id y user info decodificada.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Token faltante.")
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Formato de token inválido.")
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido.")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
        name = payload.get("name")
        email = payload.get("email")
        return {"id": user_id, "name": name, "email": email}
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")


@app.post("/compras")
def crear_compra(compra_in: CompraIn, authorization: Optional[str] = Header(None)):
    user = get_user_from_token(authorization)
    with Session(engine) as session:
        total = sum(i["cantidad"] * i["precio_unitario"] for i in compra_in.items)
        compra = Compra(
            usuario_id=compra_in.usuario_id,
            direccion_envio=compra_in.direccion_envio,
            total=total,
        )
        session.add(compra)
        session.commit()
        session.refresh(compra)

        for it in compra_in.items:
            item = CompraItem(
                compra_id=compra.id,
                producto_id=it["producto_id"],
                cantidad=it["cantidad"],
                precio_unitario=it["precio_unitario"],
            )
            session.add(item)
        session.commit()
        return {"message": "Compra registrada exitosamente", "compra_id": compra.id}
