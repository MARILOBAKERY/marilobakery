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
import asyncio
import secrets
import string
import resend
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

# Resend (email)
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
CAFE_NAME = os.environ.get('CAFE_NAME', 'MARILÓ')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

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
    address: str = "Transmetropolitana 11, San Andrés Totoltepec, Tlalpan, 14400 Ciudad de México, CDMX, México"
    phone: str = "+52 56 1984 8299"
    whatsapp: str = "+52 56 1984 8299"
    email: str = "hola@marilo.cafe"
    hours: str = "Lun - Vie: 8:00 - 20:00\nSáb - Dom: 9:00 - 22:00"
    instagram_url: str = "https://instagram.com/marilobakerycoffee"
    instagram_handle: str = "@marilobakerycoffee"
    facebook_url: str = "https://facebook.com/marilobakerycoffee"
    map_embed_url: str = "https://www.google.com/maps?q=Transmetropolitana+11,+San+Andres+Totoltepec,+Tlalpan,+14400+CDMX&output=embed"
    tagline: str = "Cafetería con un toquesito Oaxaqueño"


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
# Subscribers / Newsletter
# ---------------------------------------------------------------
class SubscribeRequest(BaseModel):
    email: EmailStr
    name: str = ""


def _gen_coupon() -> str:
    return "MARILO-" + "".join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(6))


def _build_coupon_html(name: str, coupon: str) -> str:
    greet = name.strip() or "amiga/o de MARILÓ"
    return f"""
<!doctype html><html><body style="margin:0;background:#F8F5F0;font-family:Georgia,serif;color:#382A24">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F8F5F0;padding:40px 16px">
    <tr><td align="center">
      <table role="presentation" width="540" cellspacing="0" cellpadding="0" style="max-width:540px;background:#EFE9DF;border-radius:16px;padding:48px 36px;text-align:center">
        <tr><td>
          <p style="margin:0 0 8px;letter-spacing:6px;text-transform:uppercase;font-size:11px;color:#6B5C53;font-family:Arial,sans-serif">— Cafetería de barrio</p>
          <h1 style="margin:0 0 18px;font-size:48px;letter-spacing:-1px;color:#382A24">{CAFE_NAME}</h1>
          <p style="margin:0 0 22px;font-size:18px;line-height:1.5;color:#382A24">¡Hola, {greet}! Gracias por unirte a nuestra comunidad.</p>
          <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#6B5C53;font-family:Arial,sans-serif">Te invitamos un café a la casa. Muestra este código en tu próxima visita:</p>
          <div style="display:inline-block;background:#B06D53;color:#fff;padding:18px 32px;border-radius:999px;letter-spacing:4px;font-weight:600;font-family:Arial,sans-serif;font-size:18px">{coupon}</div>
          <p style="margin:32px 0 0;font-size:12px;color:#6B5C53;font-family:Arial,sans-serif">Válido por una bebida caliente. Hasta pronto.</p>
          <p style="margin:24px 0 0;font-style:italic;color:#382A24;font-size:14px">— Con cariño, el equipo de {CAFE_NAME}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>
"""


@api_router.post("/subscribe")
async def subscribe(req: SubscribeRequest):
    email = req.email.lower().strip()
    existing = await db.subscribers.find_one({"email": email})
    if existing:
        # idempotent: return existing coupon, do not re-send to avoid abuse
        return {"ok": True, "already_subscribed": True, "coupon": existing.get("coupon", "")}

    coupon = _gen_coupon()
    doc = {
        "id": str(uuid.uuid4()),
        "email": email,
        "name": req.name.strip(),
        "coupon": coupon,
        "email_sent": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    if RESEND_API_KEY:
        params = {
            "from": SENDER_EMAIL,
            "to": [email],
            "subject": f"¡Un café a la casa en {CAFE_NAME}!",
            "html": _build_coupon_html(req.name, coupon),
        }
        try:
            await asyncio.to_thread(resend.Emails.send, params)
            doc["email_sent"] = True
        except Exception as e:
            logger.error(f"Resend failed: {e}")
            # We still save the subscriber so admin can follow up manually
    await db.subscribers.insert_one(doc)
    return {"ok": True, "already_subscribed": False, "coupon": coupon, "email_sent": doc["email_sent"]}


@api_router.get("/subscribers")
async def list_subscribers(current=Depends(get_current_admin)):
    items = await db.subscribers.find({}, {"_id": 0}).sort("created_at", -1).to_list(2000)
    return items


@api_router.delete("/subscribers/{sub_id}")
async def delete_subscriber(sub_id: str, current=Depends(get_current_admin)):
    await db.subscribers.delete_one({"id": sub_id})
    return {"ok": True}


class RedeemRequest(BaseModel):
    code: str


@api_router.post("/coupons/redeem")
async def redeem_coupon(req: RedeemRequest, current=Depends(get_current_admin)):
    code = req.code.strip().upper()
    if not code:
        raise HTTPException(status_code=400, detail="Código vacío")
    sub = await db.subscribers.find_one({"coupon": code}, {"_id": 0})
    if not sub:
        raise HTTPException(status_code=404, detail="Cupón no encontrado")
    if sub.get("redeemed"):
        return {
            "ok": False,
            "already_redeemed": True,
            "subscriber": sub,
            "message": f"Este cupón ya se canjeó el {sub.get('redeemed_at', '?')[:10]}",
        }
    now = datetime.now(timezone.utc).isoformat()
    await db.subscribers.update_one(
        {"coupon": code},
        {"$set": {"redeemed": True, "redeemed_at": now, "redeemed_by": current.get("email", "")}},
    )
    sub["redeemed"] = True
    sub["redeemed_at"] = now
    return {"ok": True, "already_redeemed": False, "subscriber": sub, "message": "Cupón canjeado con éxito"}


@api_router.get("/coupons/stats")
async def coupon_stats(current=Depends(get_current_admin)):
    total = await db.subscribers.count_documents({})
    redeemed = await db.subscribers.count_documents({"redeemed": True})
    rate = round((redeemed / total) * 100, 1) if total else 0.0
    return {"total": total, "redeemed": redeemed, "pending": total - redeemed, "conversion_rate": rate}


# ---------------------------------------------------------------
# Analytics
# ---------------------------------------------------------------
class TrackEvent(BaseModel):
    type: str  # 'product_view' | 'recipe_download'
    ref_id: str


@api_router.post("/track")
async def track_event(ev: TrackEvent):
    if ev.type not in {"product_view", "recipe_download"}:
        raise HTTPException(status_code=400, detail="Tipo de evento no soportado")
    await db.events.insert_one({
        "id": str(uuid.uuid4()),
        "type": ev.type,
        "ref_id": ev.ref_id,
        "ts": datetime.now(timezone.utc).isoformat(),
    })
    return {"ok": True}


@api_router.get("/analytics/overview")
async def analytics_overview(current=Depends(get_current_admin)):
    # Totals
    total_subs = await db.subscribers.count_documents({})
    redeemed = await db.subscribers.count_documents({"redeemed": True})
    total_menu = await db.menu_items.count_documents({})
    total_products = await db.products.count_documents({})
    total_recipes = await db.recipes.count_documents({})
    total_views = await db.events.count_documents({"type": "product_view"})
    total_downloads = await db.events.count_documents({"type": "recipe_download"})

    # Subs per week (last 8 weeks)
    now = datetime.now(timezone.utc)
    weeks = []
    for i in range(7, -1, -1):
        start = now - timedelta(days=(i + 1) * 7 - 1)
        end = now - timedelta(days=i * 7 - 1)
        start_iso = start.replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
        end_iso = end.replace(hour=23, minute=59, second=59).isoformat()
        count = await db.subscribers.count_documents({"created_at": {"$gte": start_iso, "$lte": end_iso}})
        weeks.append({"label": start.strftime("%d %b"), "subs": count})

    # Top products by views
    products = await db.products.find({}, {"_id": 0, "id": 1, "name": 1, "image_url": 1}).to_list(1000)
    products_map = {p["id"]: p for p in products}
    top_products_cursor = db.events.aggregate([
        {"$match": {"type": "product_view"}},
        {"$group": {"_id": "$ref_id", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5},
    ])
    top_products = []
    async for row in top_products_cursor:
        meta = products_map.get(row["_id"]) or {"name": "(eliminado)"}
        top_products.append({"id": row["_id"], "name": meta.get("name", "?"), "image_url": meta.get("image_url", ""), "count": row["count"]})

    # Top recipes by downloads
    recipes = await db.recipes.find({}, {"_id": 0, "id": 1, "title": 1}).to_list(1000)
    recipes_map = {r["id"]: r for r in recipes}
    top_recipes_cursor = db.events.aggregate([
        {"$match": {"type": "recipe_download"}},
        {"$group": {"_id": "$ref_id", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5},
    ])
    top_recipes = []
    async for row in top_recipes_cursor:
        meta = recipes_map.get(row["_id"]) or {"title": "(eliminada)"}
        top_recipes.append({"id": row["_id"], "title": meta.get("title", "?"), "count": row["count"]})

    return {
        "totals": {
            "subscribers": total_subs,
            "redeemed": redeemed,
            "menu_items": total_menu,
            "products": total_products,
            "recipes": total_recipes,
            "product_views": total_views,
            "recipe_downloads": total_downloads,
        },
        "subs_per_week": weeks,
        "top_products": top_products,
        "top_recipes": top_recipes,
    }


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
    # ESPECIALES
    {"name": "Quiché Vegetariano", "description": "Champiñones, espinacas, queso mozarella y huevo batido sobre una crujiente base para pay.", "price": "$121", "category": "Especiales", "order": 1},
    {"name": "Quiché de Atún", "description": "Atún, aceitunas, zanahoria, queso mozarella y huevo batido sobre una crujiente base para pay.", "price": "$136", "category": "Especiales", "order": 2},
    {"name": "Pasta Marinara", "description": "Fusilli con salsa marinara, verduras y queso mozarella.", "price": "$126", "category": "Especiales", "order": 3},
    {"name": "Fusilli al Cilantro", "description": "Salsa cremosa de cilantro, queso mozarella y tiras de pechuga de pollo.", "price": "$194", "category": "Especiales", "order": 4},
    {"name": "Lasaña", "description": "La tradicional lasaña boloñesa, acompañada de ensalada con aderezo de cilantro.", "price": "$179", "category": "Especiales", "order": 5},
    # BAGUETTES
    {"name": "Oaxaqueña", "description": "Pasta de frijolito, queso manchego y chorizo oaxaqueño.", "price": "$134", "category": "Baguettes", "order": 10},
    {"name": "Yucateca", "description": "Pasta de frijolito, cochinita pibil y queso manchego.", "price": "$146", "category": "Baguettes", "order": 11},
    {"name": "Del Huerto", "description": "Pesto, jamón de pavo, queso manchego, pepino, zanahoria y lechugas.", "price": "$116", "category": "Baguettes", "order": 12},
    {"name": "Italiana", "description": "Aderezo de jitomate, salami, queso manchego y lechugas.", "price": "$116", "category": "Baguettes", "order": 13},
    {"name": "Fungi", "description": "Mantequilla, champiñones salteados al ajillo, queso manchego y espinacas baby.", "price": "$116", "category": "Baguettes", "order": 14},
    # PIZZAS
    {"name": "Pizza Salami", "description": "Salami y queso mozarella con nuestra receta especial de salsa de tomate.", "price": "$125", "category": "Pizzas", "order": 20},
    {"name": "Pizza Vegetariana", "description": "Espinacas frescas, champiñones, calabacitas zucchini y aceitunas negras.", "price": "$125", "category": "Pizzas", "order": 21},
    {"name": "Pizza Poblana", "description": "Rajas poblanas, granitos de elote amarillo, cebolla morada y queso mozarella.", "price": "$125", "category": "Pizzas", "order": 22},
    {"name": "Pizza Pesto", "description": "Pesto de albahaca y parmesano, acompañada de tomates cherry y queso mozarella.", "price": "$125", "category": "Pizzas", "order": 23},
    {"name": "Pizza Chapulines", "description": "Receta de casa con crema de ajo y albahaca, mozzarella, champiñones y chapulines traídos de Oaxaca.", "price": "$139", "category": "Pizzas", "order": 24},
    # ENSALADAS
    {"name": "Ensalada Mariló", "description": "Lechuga, pepino, zanahoria rayada, col morada, fresas, mezcla de semillas y aderezo de cilantro al limón.", "price": "$126", "category": "Ensaladas", "order": 30},
    {"name": "Ensalada Fresca", "description": "Espinacas frescas, manzana, pecanas troceadas, arándanos deshidratados y queso de cabra. Aceite de oliva y vinagre balsámico.", "price": "$134", "category": "Ensaladas", "order": 31},
    # BRUNCH
    {"name": "Molletes", "description": "Frijoles aromatizados con hoja de aguacate, sobre crujiente baguette horneada en Mariló y queso manchego gratinado.", "price": "$99", "category": "Brunch", "order": 40},
    {"name": "Chilaquiles Oaxaqueños", "description": "Coloradito o mole negro, crema y queso gratinado.", "price": "$115", "category": "Brunch", "order": 41},
    {"name": "Chilaquiles Tradicionales", "description": "Salsa verde o roja, crema y queso gratinado.", "price": "$105", "category": "Brunch", "order": 42},
    # BARRA DE CAFE
    {"name": "Espresso", "description": "Shot de espresso 30 ml.", "price": "$37", "category": "Barra de Café", "order": 50},
    {"name": "Doppio", "description": "2 shots de espresso 60 ml.", "price": "$42", "category": "Barra de Café", "order": 51},
    {"name": "Macchiato", "description": "Shot de espresso 30 ml + leche.", "price": "$45", "category": "Barra de Café", "order": 52},
    {"name": "Americano", "description": "2 shots de espresso 60 ml + agua.", "price": "$49", "category": "Barra de Café", "order": 53},
    {"name": "Cappuccino", "description": "1 a 2 shots de espresso 60 ml + leche.", "price": "$65", "category": "Barra de Café", "order": 54},
    {"name": "Moka", "description": "2 shots de espresso + chocolate + leche.", "price": "$74", "category": "Barra de Café", "order": 55},
    {"name": "Affogato", "description": "2 shots de espresso + helado de vainilla.", "price": "$98", "category": "Barra de Café", "order": 56},
    {"name": "Carajillo", "description": "2 shots de espresso + 60 ml de Licor 43 (frío).", "price": "$139", "category": "Barra de Café", "order": 57},
    # LATTES
    {"name": "Latte", "description": "1 a 2 shots de espresso 60 ml + leche.", "price": "$65", "category": "Lattes", "order": 60},
    {"name": "Chai", "description": "Mezcla de especias orientales.", "price": "$85", "category": "Lattes", "order": 61},
    {"name": "Taro", "description": "Tubérculo con distintivo color violeta y delicado sabor dulce.", "price": "$85", "category": "Lattes", "order": 62},
    {"name": "Mazapán", "description": "Tradicional dulce mexicano de cacahuate.", "price": "$85", "category": "Lattes", "order": 63},
    {"name": "Dirty Chai", "description": "Espresso + mezcla de especias orientales.", "price": "$85", "category": "Lattes", "order": 64},
    {"name": "Matcha", "description": "Sabor a hojas de té verde finamente molidas.", "price": "$89", "category": "Lattes", "order": 65},
    # CHOCOLATE
    {"name": "Chocolate Clásico", "description": "Cremoso y reconfortante.", "price": "$65", "category": "Chocolate", "order": 70},
    {"name": "White Cocoa", "description": "Chocolate blanco aterciopelado.", "price": "$85", "category": "Chocolate", "order": 71},
    {"name": "Chocolate Oaxaqueño", "description": "Base agua o base leche. 100% artesanal. Cacao especial, canela, almendras y azúcar morena.", "price": "$79", "category": "Chocolate", "order": 72},
    # TES & TISANAS
    {"name": "Té y Tisanas (12 oz)", "description": "Selección de la casa.", "price": "$63", "category": "Tés & Tisanas", "order": 80},
    {"name": "Té Frío (16 oz)", "description": "Té helado de temporada.", "price": "$70", "category": "Tés & Tisanas", "order": 81},
    # FRAPPES
    {"name": "Frappe Cappuccino", "description": "Espresso, leche y hielo.", "price": "$84", "category": "Frappes", "order": 90},
    {"name": "Frappe Moka", "description": "Espresso, chocolate, leche y hielo.", "price": "$98", "category": "Frappes", "order": 91},
    {"name": "Frappe Chocolate", "description": "Chocolate cremoso frappeado.", "price": "$97", "category": "Frappes", "order": 92},
    {"name": "Frappe White Cocoa", "description": "Chocolate blanco frappeado.", "price": "$117", "category": "Frappes", "order": 93},
    {"name": "Frappe Chai", "description": "Especias orientales frappeadas.", "price": "$117", "category": "Frappes", "order": 94},
    {"name": "Frappe Taro", "description": "Taro suave y dulce frappeado.", "price": "$117", "category": "Frappes", "order": 95},
    {"name": "Frappe Matcha", "description": "Matcha en frío.", "price": "$117", "category": "Frappes", "order": 96},
    {"name": "Frappe Mazapán", "description": "Mazapán mexicano frappeado.", "price": "$117", "category": "Frappes", "order": 97},
    {"name": "Frappe Dirty Chai", "description": "Espresso + chai frappeado.", "price": "$117", "category": "Frappes", "order": 98},
    {"name": "Smoothie", "description": "Fruta natural batida.", "price": "$79", "category": "Frappes", "order": 99},
    {"name": "Chamoyada", "description": "Fresa o mango con chamoy.", "price": "$76", "category": "Frappes", "order": 100},
    {"name": "Tejate de Frutas", "description": "Limón, fresa, maracuyá o mango.", "price": "$78", "category": "Frappes", "order": 101},
    # BEBIDAS FRIAS
    {"name": "Naranjada / Limonada", "description": "Recién exprimida.", "price": "$67", "category": "Bebidas Frías", "order": 110},
    {"name": "San Pellegrino", "description": "Agua mineral italiana.", "price": "$48", "category": "Bebidas Frías", "order": 111},
    {"name": "Coca Cola", "description": "Clásico de siempre.", "price": "$43", "category": "Bebidas Frías", "order": 112},
    {"name": "Arizona", "description": "Té helado importado.", "price": "$41", "category": "Bebidas Frías", "order": 113},
    {"name": "Agua Embotellada", "description": "Natural.", "price": "$30", "category": "Bebidas Frías", "order": 114},
    {"name": "Colima Beer", "description": "Cerveza artesanal mexicana.", "price": "$79", "category": "Bebidas Frías", "order": 115},
    {"name": "Vinito Lambrusco", "description": "Copa de vino espumoso.", "price": "$99", "category": "Bebidas Frías", "order": 116},
    # REPOSTERIA
    {"name": "Galletas de Mantequilla", "description": "Recién horneadas.", "price": "$54", "category": "Repostería", "order": 120},
    {"name": "Galletas de Chispas de Chocolate", "description": "Crujientes por fuera, suaves por dentro.", "price": "$54", "category": "Repostería", "order": 121},
    {"name": "Rol de Canela", "description": "Esponjoso, con glaseado.", "price": "$54", "category": "Repostería", "order": 122},
    {"name": "Tarta de Manzana", "description": "Manzana caramelizada en hojaldre.", "price": "$81", "category": "Repostería", "order": 123},
    {"name": "Brownie", "description": "De chocolate oaxaqueño y helado de vainilla.", "price": "$114", "category": "Repostería", "order": 124},
    {"name": "Cake del Día", "description": "Vainilla con fresas, choco avellanas, tres leches o zanahoria con nuez.", "price": "$106", "category": "Repostería", "order": 125},
]

SAMPLE_PRODUCTS = [
    {"name": "Café en Grano 250g", "description": "Tueste medio • Notas a chocolate y cereza", "price": "$240", "image_url": "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=800&q=80", "order": 1, "available": True},
    {"name": "Taza Cerámica MARILÓ", "description": "Hecha a mano por artesanas locales", "price": "$280", "image_url": "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80", "order": 2, "available": True},
    {"name": "Miel Artesanal 300g", "description": "Miel multifloral de productores cercanos", "price": "$180", "image_url": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80", "order": 3, "available": True},
    {"name": "Mermelada de Higo", "description": "Receta de la casa • Bote de 250ml", "price": "$120", "image_url": "https://images.unsplash.com/photo-1597528380122-1f8b704218b5?w=800&q=80", "order": 4, "available": True},
]

SAMPLE_GALLERY = [
    {"image_url": "https://customer-assets.emergentagent.com/job_cafe-gallery-store/artifacts/api68md5_IMG_4142.jpeg", "caption": "Café con corazón", "order": 1},
    {"image_url": "https://customer-assets.emergentagent.com/job_cafe-gallery-store/artifacts/of50g9a0_IMG_0966.jpeg", "caption": "Mezcal artesanal Espadín", "order": 2},
    {"image_url": "https://customer-assets.emergentagent.com/job_cafe-gallery-store/artifacts/qooffp3n_IMG_2550.jpeg", "caption": "Merengues hechos a mano", "order": 3},
    {"image_url": "https://customer-assets.emergentagent.com/job_cafe-gallery-store/artifacts/q3nerk1k_IMG_5555.jpeg", "caption": "Pastel de nuez con crema batida", "order": 4},
]


MENU_SEED_VERSION = "marilo_oaxaca_v3"
GALLERY_SEED_VERSION = "marilo_gallery_v3"


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
        if not verify_password(ADMIN_PASSWORD, existing.get("password_hash", "")):
            await db.users.update_one({"email": ADMIN_EMAIL}, {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}})
            logger.info("Admin password synced with env")

    # Menu seed (with versioned migration). When MENU_SEED_VERSION changes
    # we drop the existing seed and reseed. Admin custom edits are preserved
    # only if same version — otherwise (initial setup) they're replaced.
    meta = await db.meta.find_one({"_id": "menu_seed"})
    if not meta or meta.get("version") != MENU_SEED_VERSION:
        await db.menu_items.delete_many({})
        for it in SAMPLE_MENU:
            obj = MenuItem(**it)
            await db.menu_items.insert_one(obj.model_dump())
        await db.meta.update_one({"_id": "menu_seed"}, {"$set": {"version": MENU_SEED_VERSION}}, upsert=True)
        logger.info(f"Seeded menu items (version {MENU_SEED_VERSION})")

    # Seed sample products if empty
    if await db.products.count_documents({}) == 0:
        for it in SAMPLE_PRODUCTS:
            obj = Product(**it)
            await db.products.insert_one(obj.model_dump())
        logger.info("Seeded sample products")

    # Seed sample gallery (versioned). On version bump we reseed.
    gmeta = await db.meta.find_one({"_id": "gallery_seed"})
    if not gmeta or gmeta.get("version") != GALLERY_SEED_VERSION:
        await db.gallery.delete_many({})
        for it in SAMPLE_GALLERY:
            obj = GalleryImage(**it)
            await db.gallery.insert_one(obj.model_dump())
        await db.meta.update_one({"_id": "gallery_seed"}, {"$set": {"version": GALLERY_SEED_VERSION}}, upsert=True)
        logger.info(f"Seeded gallery (version {GALLERY_SEED_VERSION})")

    # Ensure default settings exist
    if not await db.settings.find_one({"_id": "cafe"}):
        await db.settings.insert_one({"_id": "cafe", **CafeSettings().model_dump()})
        logger.info("Seeded default cafe settings")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
