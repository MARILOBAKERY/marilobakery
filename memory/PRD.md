# MARILÓ Café — PRD

## Original Problem Statement
> "quiero una pagina web para mi cafetería, donde mis clientes puedan ver la carta, donde encuentren nuestra ubicación, contacto, redes sociales, la galería de imágenes de nuestro instagram, una estantería donde mis clientes puedan descargar algunas recetas e instructivos y también un espacio donde pueda subir algunos artículos disponibles de nuestra tiendita física."

## User Choices
- **Name**: MARILÓ
- **Style**: Bohemian / Artisanal / Rustic-cozy
- **Admin panel**: Single-user login (`admin@marilo.cafe` / `admin123`)
- **Instagram**: Follow button (no API integration)
- **Tiendita**: Showcase only (no online checkout)
- **Recipes**: Downloadable PDFs managed from admin

## Architecture
- **Backend**: FastAPI + Motor (MongoDB) + JWT (PyJWT) + bcrypt password hashing
- **Frontend**: React 19 + react-router-dom + framer-motion + react-fast-marquee + Shadcn UI + Tailwind
- **Storage**: PDFs and images are stored as base64 data URLs in MongoDB (small-scale)
- **Routes**:
  - `/` public homepage (hero, carta, tiendita, recetas, galería, ubicación, footer)
  - `/admin/login` — admin login
  - `/admin/menu | /tiendita | /recetas | /galeria | /ajustes` — protected admin

## Personas
- **Cliente**: visita la página para conocer la carta, ubicación, horarios, descargar recetas, ver productos y seguir Instagram.
- **Admin (dueña)**: gestiona contenidos desde el panel sin tocar código.

## Implemented (2025-12)
- Public marketing site: hero with image, marquee ribbon, menu (asymmetric layout), tiendita grid, recipe shelf, masonry gallery + Instagram CTA, split location/footer with embedded map.
- Admin panel with sidebar nav: Carta CRUD, Tiendita CRUD, Recetas (PDF upload), Galería (image upload), Ajustes (cafe info).
- Auth: JWT bearer, admin auto-seed on startup, password kept in sync with `.env`.
- Sample data auto-seeded on first run (9 menu items, 4 products, 6 gallery images, default settings).
- Spanish UI throughout.

## Backlog
- **P1**: Internationalization (EN/ES toggle), SEO meta tags & Open Graph image, sitemap.
- **P1**: Image optimization pipeline (store original + WebP) — currently base64 data URLs are heavy.
- **P2**: Reserve-a-table form with WhatsApp deeplink.
- **P2**: Newsletter signup (Resend/Mailchimp).
- **P2**: Categories/tags for recipes; search bar in shelf.
- **P2**: Public Instagram feed via official API once approved.
- **P3**: Loyalty card / digital stamp card for repeat customers.

## Next Action Items
- Replace placeholder cafe info from `/admin/ajustes` with real data (address, hours, phone, IG handle, Google Maps embed).
- Replace placeholder Unsplash images on the Tiendita with real product photos.
- Upload first set of recipe PDFs.


## Updates (2026-02)
- Hero: reemplazado título tipográfico "MARILÓ" por el **logo oficial circular rosa** (artifact `Marilo.png`); tagline "CAFETERÍA CON UN TOQUESITO OAXAQUEÑO" movido debajo del logo.
- **Combo SOPA + BEBIDA + $87** insertado como bloque amarillo entre las categorías "Especiales" y "Baguettes" del menú (texto: "ARMA TU PACK DE COMIDA — Sopa de 225 ml. Bebidas incluidas: sodas, agua mineral, naranjada, limonada o agua embotellada.").
- Galería: título grande "GALERÍA" agregado, layout en mosaico (col-span/row-span dinámico), 5 nuevas fotografías reales del local (mezcal, latte, interior, pastel, merengues) sembradas vía `GALLERY_SEED_VERSION = marilo_gallery_v2`.
- Backend `server.py`: nueva constante `GALLERY_SEED_VERSION` con migración automática igual que el menú.
