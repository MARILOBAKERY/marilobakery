from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import uuid
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional

import jwt
import bcrypt
from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr


# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Auth config
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"
JWT_EXP_HOURS = 24 * 7  # 7 days for admin convenience
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@marilo.cafe')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')

app = FastAPI(title="MARILÓ Café API")
api_router = APIRouter(prefix="/api")
bearer_scheme = HTTPBearer(auto_error=False)


# ---------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXP_HOURS),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_admin(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> dict:
    if credentials is None or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = await db.users.find_one({"id": payload.get("sub")}, {"_id": 0, "password_hash": 0})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="User not found or not admin")
    return user


# ---------------------------------------------------------------
# Models
# ---------------------------------------------------------------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class MenuItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str = ""
    price: str
    category: str  # e.g., "Cafés", "Tés", "Panadería", "Brunch"
    order: int = 0
    available: bool = True


class MenuItemCreate(BaseModel):
    name: str
    description: str = ""
    price: str
    category: str
    order: int = 0
    available: bool = True


class GalleryImage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    image_url: str  # data URL (base64) or external URL
    caption: str = ""
    order: int = 0


class GalleryImageCreate(BaseModel):
    image_url: str
    caption: str = ""
    order: int = 0


class Recipe(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str = ""
    pdf_data: str  # data URL (base64 PDF)
    cover_image: str = ""  # optional cover image data URL
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class RecipeCreate(BaseModel):
    title: str
    description: str = ""
    pdf_data: str
    cover_image: str = ""


class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str = ""
    price: str = ""
    image_url: str = ""
    available: bool = True
    order: int = 0


class ProductCreate(BaseModel):
    name: str
    description: str = ""
    price: str = ""
    image_url: str = ""
    available: bool = True
    order: int = 0


class CafeSettings(BaseModel):
    address: str = "Calle Imaginaria 123, Tu Ciudad"
    phone: str = "+00 000 000 000"
    whatsapp: str = "+00 000 000 000"
    email: str = "hola@marilo.cafe"
    hours: str = "Lun - Vie: 8:00 - 20:00\nSáb - Dom: 9:00 - 22:00"
    instagram_url: str = "https://instagram.com/marilocafeteria"
    instagram_handle: str = "@marilocafeteria"
    facebook_url: str = ""
    map_embed_url: str = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.012345!2d-99.1332!3d19.4326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCDMX!5e0!3m2!1ses!2smx!4v0"
    tagline: str = "Café Artesanal • Repostería Fresca • Alma Bohemia"


# ---------------------------------------------------------------
# Auth Routes
# ---------------------------------------------------------------
@api_router.post("/auth/login", response_model=LoginResponse)
async def login(req: LoginRequest):
    email = req.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(req.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    token = create_access_token(user["id"], user["email"])
    user_public = {"id": user["id"], "email": user["email"], "role": user.get("role", "admin"), "name": user.get("name", "Admin")}
    return LoginResponse(access_token=token, user=user_public)


@api_router.get("/auth/me")
async def me(current=Depends(get_current_admin)):
    return current


@api_router.post("/auth/logout")
async def logout(current=Depends(get_current_admin)):
    return {"ok": True}


# ---------------------------------------------------------------
# Public Routes
# ---------------------------------------------------------------
@api_router.get("/settings", response_model=CafeSettings)
async def get_settings():
    doc = await db.settings.find_one({"_id": "cafe"}, {"_id": 0})
    if not doc:
        defaults = CafeSettings().model_dump()
        await db.settings.insert_one({"_id": "cafe", **defaults})
        return CafeSettings(**defaults)
    return CafeSettings(**doc)


@api_router.put("/settings", response_model=CafeSettings)
async def update_settings(settings: CafeSettings, current=Depends(get_current_admin)):
    data = settings.model_dump()
    await db.settings.update_one({"_id": "cafe"}, {"$set": data}, upsert=True)
    return settings


# Menu
@api_router.get("/menu", response_model=List[MenuItem])
async def list_menu():
    items = await db.menu_items.find({}, {"_id": 0}).sort("order", 1).to_list(1000)
    return [MenuItem(**i) for i in items]


@api_router.post("/menu", response_model=MenuItem)
async def create_menu_item(item: MenuItemCreate, current=Depends(get_current_admin)):
    obj = MenuItem(**item.model_dump())
    await db.menu_items.insert_one(obj.model_dump())
    return obj


@api_router.put("/menu/{item_id}", response_model=MenuItem)
async def update_menu_item(item_id: str, item: MenuItemCreate, current=Depends(get_current_admin)):
    data = item.model_dump()
    res = await db.menu_items.update_one({"id": item_id}, {"$set": data})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="No encontrado")
    updated = await db.menu_items.find_one({"id": item_id}, {"_id": 0})
    return MenuItem(**updated)


@api_router.delete("/menu/{item_id}")
async def delete_menu_item(item_id: str, current=Depends(get_current_admin)):
    await db.menu_items.delete_one({"id": item_id})
    return {"ok": True}


# Gallery
@api_router.get("/gallery", response_model=List[GalleryImage])
async def list_gallery():
    items = await db.gallery.find({}, {"_id": 0}).sort("order", 1).to_list(1000)
    return [GalleryImage(**i) for i in items]


@api_router.post("/gallery", response_model=GalleryImage)
async def create_gallery(item: GalleryImageCreate, current=Depends(get_current_admin)):
    obj = GalleryImage(**item.model_dump())
    await db.gallery.insert_one(obj.model_dump())
    return obj


@api_router.delete("/gallery/{item_id}")
async def delete_gallery(item_id: str, current=Depends(get_current_admin)):
    await db.gallery.delete_one({"id": item_id})
    return {"ok": True}


# Recipes
@api_router.get("/recipes")
async def list_recipes():
    """Return recipes WITHOUT pdf_data (to keep payload small). Use /recipes/{id} for full PDF."""
    items = await db.recipes.find({}, {"_id": 0, "pdf_data": 0}).sort("created_at", -1).to_list(1000)
    return items


@api_router.get("/recipes/{recipe_id}")
async def get_recipe(recipe_id: str):
    item = await db.recipes.find_one({"id": recipe_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="No encontrada")
    return item


@api_router.post("/recipes", response_model=Recipe)
async def create_recipe(item: RecipeCreate, current=Depends(get_current_admin)):
    obj = Recipe(**item.model_dump())
    await db.recipes.insert_one(obj.model_dump())
    return obj


@api_router.delete("/recipes/{recipe_id}")
async def delete_recipe(recipe_id: str, current=Depends(get_current_admin)):
    await db.recipes.delete_one({"id": recipe_id})
    return {"ok": True}


# Products (Tiendita)
@api_router.get("/products", response_model=List[Product])
async def list_products():
    items = await db.products.find({}, {"_id": 0}).sort("order", 1).to_list(1000)
    return [Product(**i) for i in items]


@api_router.post("/products", response_model=Product)
async def create_product(item: ProductCreate, current=Depends(get_current_admin)):
    obj = Product(**item.model_dump())
    await db.products.insert_one(obj.model_dump())
    return obj


@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, item: ProductCreate, current=Depends(get_current_admin)):
    data = item.model_dump()
    res = await db.products.update_one({"id": product_id}, {"$set": data})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="No encontrado")
    updated = await db.products.find_one({"id": product_id}, {"_id": 0})
    return Product(**updated)


@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, current=Depends(get_current_admin)):
    await db.products.delete_one({"id": product_id})
    return {"ok": True}


@api_router.get("/")
async def root():
    return {"app": "MARILÓ Café", "status": "ok"}


# ---------------------------------------------------------------
# App configuration
# ---------------------------------------------------------------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------
# Startup: seed admin and sample data
# ---------------------------------------------------------------
SAMPLE_MENU = [
    {"name": "Espresso", "description": "Granos de origen único, extracción corta", "price": "$35", "category": "Cafés", "order": 1},
    {"name": "Cappuccino", "description": "Espresso, leche vaporizada, espuma sedosa", "price": "$55", "category": "Cafés", "order": 2},
    {"name": "Latte de Lavanda", "description": "Toques florales y miel artesanal", "price": "$70", "category": "Cafés", "order": 3},
    {"name": "Chai Masala", "description": "Especias frescas molidas en casa", "price": "$60", "category": "Tés", "order": 4},
    {"name": "Matcha Latte", "description": "Matcha ceremonial, leche de avena", "price": "$75", "category": "Tés", "order": 5},
    {"name": "Croissant de Mantequilla", "description": "Hojaldre francés horneado cada mañana", "price": "$45", "category": "Panadería", "order": 6},
    {"name": "Pan de Plátano", "description": "Con nueces tostadas y canela", "price": "$50", "category": "Panadería", "order": 7},
    {"name": "Avocado Toast", "description": "Pan de masa madre, aguacate, semillas", "price": "$95", "category": "Brunch", "order": 8},
    {"name": "Bowl de Yogur Griego", "description": "Frutas de temporada, granola casera", "price": "$85", "category": "Brunch", "order": 9},
]

SAMPLE_PRODUCTS = [
    {"name": "Café en Grano 250g", "description": "Tueste medio • Notas a chocolate y cereza", "price": "$240", "image_url": "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=800&q=80", "order": 1, "available": True},
    {"name": "Taza Cerámica MARILÓ", "description": "Hecha a mano por artesanas locales", "price": "$280", "image_url": "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80", "order": 2, "available": True},
    {"name": "Miel Artesanal 300g", "description": "Miel multifloral de productores cercanos", "price": "$180", "image_url": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80", "order": 3, "available": True},
    {"name": "Mermelada de Higo", "description": "Receta de la casa • Bote de 250ml", "price": "$120", "image_url": "https://images.unsplash.com/photo-1597528380122-1f8b704218b5?w=800&q=80", "order": 4, "available": True},
]

SAMPLE_GALLERY = [
    {"image_url": "https://images.unsplash.com/photo-1712630514718-3830cc6c0d0a?w=1200&q=80", "caption": "Nuestra mesa de roble", "order": 1},
    {"image_url": "https://images.unsplash.com/photo-1578231177134-f1bbe379b054?w=1200&q=80", "caption": "Rincón de lectura", "order": 2},
    {"image_url": "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=1200&q=80", "caption": "Café & pan recién hecho", "order": 3},
    {"image_url": "https://images.unsplash.com/photo-1598022186152-1b66e6c38245?w=1200&q=80", "caption": "Cappuccino de la casa", "order": 4},
    {"image_url": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80", "caption": "Detalles que enamoran", "order": 5},
    {"image_url": "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200&q=80", "caption": "Brunch del fin de semana", "order": 6},
]


@app.on_event("startup")
async def startup_event():
    # Seed admin
    existing = await db.users.find_one({"email": ADMIN_EMAIL})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": ADMIN_EMAIL,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "name": "Admin MARILÓ",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Seeded admin user: {ADMIN_EMAIL}")
    else:
        # keep password in sync with env (so resets are easy)
        if not verify_password(ADMIN_PASSWORD, existing.get("password_hash", "")):
            await db.users.update_one({"email": ADMIN_EMAIL}, {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}})
            logger.info("Admin password synced with env")

    # Seed sample menu if empty
    if await db.menu_items.count_documents({}) == 0:
        for it in SAMPLE_MENU:
            obj = MenuItem(**it)
            await db.menu_items.insert_one(obj.model_dump())
        logger.info("Seeded sample menu items")

    # Seed sample products if empty
    if await db.products.count_documents({}) == 0:
        for it in SAMPLE_PRODUCTS:
            obj = Product(**it)
            await db.products.insert_one(obj.model_dump())
        logger.info("Seeded sample products")

    # Seed sample gallery if empty
    if await db.gallery.count_documents({}) == 0:
        for it in SAMPLE_GALLERY:
            obj = GalleryImage(**it)
            await db.gallery.insert_one(obj.model_dump())
        logger.info("Seeded sample gallery")

    # Ensure default settings exist
    if not await db.settings.find_one({"_id": "cafe"}):
        await db.settings.insert_one({"_id": "cafe", **CafeSettings().model_dump()})
        logger.info("Seeded default cafe settings")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
