import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Instagram, MapPin, Phone, Clock, Mail, Download, ArrowRight, ChevronDown, Facebook, MessageCircle, Menu as MenuIcon, X } from "lucide-react";
import { api, API } from "@/lib/api";
import SubscribeSection from "@/components/SubscribeSection";

const HERO_IMG = "https://static.prod-images.emergentagent.com/jobs/2c8c7351-1d32-4d6c-aa89-3bc9598401bf/images/b1540473a07df519af6283012d2adb0c5225f0e576585d639754d42ee6aa120f.png";

// Section background rotation — 4 flat colors
const SECTION_BG = ["#FFFAF1", "#F5C9CD", "#D5E5EA", "#DDE7CC"];
const CAT_ACCENTS = ["#E27282", "#8FBAC5", "#ADC388", "#caa600"];

export default function HomePage() {
  const [menu, setMenu] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [settings, setSettings] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/menu").then((r) => setMenu(r.data)),
      api.get("/gallery").then((r) => setGallery(r.data)),
      api.get("/recipes").then((r) => setRecipes(r.data)),
      api.get("/settings").then((r) => setSettings(r.data)),
    ]).catch(() => {});
  }, []);

  const categories = [...new Set(menu.map((m) => m.category))];
  const scrollTo = (id) => { setMobileOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  const waNumber = settings?.whatsapp ? settings.whatsapp.replace(/[^\d]/g, "") : "";
  const waValid = waNumber.length >= 8 && /[1-9]/.test(waNumber);
  const waLink = waValid ? `https://wa.me/${waNumber}?text=${encodeURIComponent("¡Hola MARILÓ! Quisiera más información.")}` : null;

  return (
    <div className="relative">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[var(--marilo-cream)]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-5 sm:px-10 py-4 flex items-center justify-between">
          <button onClick={() => scrollTo("hero")} className="font-display text-3xl text-[var(--marilo-coral)] tracking-wide" data-testid="nav-home">MARILÓ</button>
          <div className="hidden md:flex items-center gap-7 text-[12px] tracking-wider uppercase font-semibold">
            <button onClick={() => scrollTo("menu")} className="hover:text-[var(--marilo-coral)] transition" data-testid="nav-menu">Carta</button>
            <button onClick={() => scrollTo("tiendita")} className="hover:text-[var(--marilo-coral)] transition" data-testid="nav-shop">Tiendita</button>
            <button onClick={() => scrollTo("recetas")} className="hover:text-[var(--marilo-coral)] transition" data-testid="nav-recipes">Recetas</button>
            <button onClick={() => scrollTo("gallery")} className="hover:text-[var(--marilo-coral)] transition" data-testid="nav-gallery">Galería</button>
            <button onClick={() => scrollTo("location")} className="hover:text-[var(--marilo-coral)] transition" data-testid="nav-location">Visítanos</button>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/login" className="hidden sm:inline text-[10px] uppercase tracking-widest text-black/50 hover:text-[var(--marilo-coral)]" data-testid="nav-admin">Admin</Link>
            <button onClick={() => setMobileOpen((v) => !v)} className="md:hidden p-2 -mr-2" aria-label="Menú" data-testid="mobile-menu-btn">
              {mobileOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden bg-white">
              <div className="px-5 py-3 flex flex-col text-base">
                {[{ id: "menu", l: "Carta" }, { id: "tiendita", l: "Tiendita" }, { id: "recetas", l: "Recetas" }, { id: "gallery", l: "Galería" }, { id: "suscribete", l: "Café Gratis" }, { id: "location", l: "Visítanos" }].map((m) => (
                  <button key={m.id} onClick={() => scrollTo(m.id)} className="text-left py-3 border-b border-black/10 tracking-wider uppercase text-sm font-semibold">{m.l}</button>
                ))}
                <Link to="/admin/login" className="py-3 text-xs uppercase tracking-widest text-black/60">Admin</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO — cream */}
      <section id="hero" className="bg-[var(--marilo-cream)] pt-24 sm:pt-28 pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 text-center">
          <p className="tracking-[0.4em] text-[11px] sm:text-xs text-black/60 mb-3 font-semibold uppercase">Cafetería con un toquesito Oaxaqueño</p>
          <h1 className="font-display text-[5rem] sm:text-[9rem] lg:text-[13rem] leading-[0.85] text-[var(--marilo-coral)] tracking-wide" data-testid="hero-title">
            MARILÓ
          </h1>
          <p className="font-script text-2xl sm:text-3xl lg:text-4xl mt-8 max-w-3xl mx-auto leading-snug text-black/85">
            Aquí comes <span className="text-[var(--marilo-coral)]">rico y bonito</span>, te tomas un buen <span className="text-[var(--marilo-coral)]">cafecito</span> y lo acompañas con un rico <span className="text-[var(--marilo-coral)]">postrecito</span>.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => scrollTo("menu")} data-testid="hero-cta-menu" className="btn-pill bg-[var(--marilo-coral)] text-white inline-flex items-center gap-2">
              Ver la carta <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => scrollTo("location")} className="btn-pill bg-[#fdda25] text-black inline-flex items-center gap-2">
              Cómo llegar
            </button>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 max-w-6xl mx-auto px-5 sm:px-10">
          <div className="grid sm:grid-cols-5 overflow-hidden">
            <div className="sm:col-span-3 aspect-[4/3] sm:aspect-auto">
              <img src={HERO_IMG} alt="MARILÓ" className="w-full h-full object-cover" />
            </div>
            <div className="sm:col-span-2 p-8 sm:p-12 flex flex-col justify-center" style={{ background: "var(--marilo-soft-coral)" }}>
              <h3 className="font-display text-3xl sm:text-4xl text-black tracking-wide mb-3">BIENVENIDA</h3>
              <p className="font-script text-xl sm:text-2xl leading-snug text-black/85">
                Un rincón donde el café, la repostería y la cocina oaxaqueña se encuentran. Pasa, siéntate y respira: ya estás en casa.
              </p>
            </div>
          </div>
        </div>

        <button onClick={() => scrollTo("menu")} className="block mx-auto mt-12 text-black/50 hover:text-black animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </button>
      </section>

      {/* Single color band */}
      <div className="bg-[var(--marilo-coral)] text-white py-5 text-center">
        <p className="font-display tracking-[0.3em] text-base sm:text-lg">— HECHO EN OAXACA CON CARIÑO —</p>
      </div>

      {/* MENU — alternating section backgrounds per category */}
      <section id="menu" data-testid="menu-section" className="bg-[var(--marilo-cream)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 py-16 sm:py-24 text-center">
          <p className="tracking-[0.4em] text-xs text-black/60 font-semibold uppercase">— Nuestra carta —</p>
          <h2 className="font-display text-5xl sm:text-7xl text-[var(--marilo-coral)] mt-3 tracking-wide">
            SABORES QUE ABRAZAN
          </h2>
          <p className="font-script text-xl sm:text-2xl mt-4 max-w-xl mx-auto text-black/75">
            Comida con corazón, café especial y repostería casera. Auténticamente oaxaqueña.
          </p>
        </div>

        {categories.map((cat, ci) => {
          const items = menu.filter((m) => m.category === cat && m.available);
          const bg = SECTION_BG[ci % 4];
          const accent = CAT_ACCENTS[ci % 4];
          return (
            <div
              key={cat}
              data-testid={`menu-category-${cat.toLowerCase().replace(/[\s&]+/g, "-")}`}
              style={{ background: bg }}
            >
              <div className="max-w-6xl mx-auto px-5 sm:px-10 py-14 sm:py-20">
                <div className="flex items-baseline gap-5 mb-8">
                  <h3 className="font-display text-4xl sm:text-6xl tracking-wide leading-none" style={{ color: accent }}>{cat.toUpperCase()}</h3>
                  <span className="flex-1 h-px bg-black/20" />
                </div>
                <ul className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-baseline gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-base sm:text-lg text-black">{item.name}</span>
                          <span className="flex-1 border-b border-dotted border-black/30 translate-y-[-3px]" />
                          <span className="font-bold text-base sm:text-lg text-black whitespace-nowrap">{item.price}</span>
                        </div>
                        {item.description && <p className="text-sm text-black/65 mt-1 leading-snug">{item.description}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
        {menu.length === 0 && <p className="text-black/60 italic text-center py-12">La carta llegará pronto…</p>}
      </section>

      {/* TIENDITA — coral */}
      <section id="tiendita" data-testid="tiendita-section" className="bg-[var(--marilo-coral)] text-white py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-5 sm:px-10 text-center">
          <p className="tracking-[0.4em] text-xs text-white/80 font-semibold uppercase">— Tiendita —</p>
          <h2 className="font-display text-6xl sm:text-8xl mt-4 tracking-wide">PRÓXIMAMENTE</h2>
          <p className="font-script text-xl sm:text-2xl mt-6 max-w-xl mx-auto text-white/95">
            Pronto encontrarás aquí nuestros productos artesanales para llevar a casa: granos de café, tazas, mermeladas, miel y más sorpresitas hechas con cariño en MARILÓ.
          </p>
          {waLink && (
            <a href={waLink} target="_blank" rel="noreferrer" className="btn-pill bg-[#fdda25] text-black inline-flex items-center gap-2 mt-10" data-testid="tiendita-whatsapp">
              Avísame cuando esté lista <MessageCircle className="w-4 h-4" />
            </a>
          )}
        </div>
      </section>

      {/* RECETAS — dusty blue */}
      <section id="recetas" data-testid="recipe-shelf-section" className="bg-[var(--marilo-blue)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 py-20 sm:py-28">
          <div className="text-center mb-12">
            <p className="tracking-[0.4em] text-xs text-black/70 font-semibold uppercase">— Estantería —</p>
            <h2 className="font-display text-5xl sm:text-7xl text-black mt-3 tracking-wide">RECETAS DE LA CASA</h2>
            <p className="font-script text-xl sm:text-2xl mt-4 max-w-xl mx-auto text-black/80">
              Descarga nuestras recetas favoritas para preparar la magia de MARILÓ en tu cocina.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {recipes.map((r, idx) => (
              <div key={r.id} className="bg-white overflow-hidden flex flex-col">
                <div className="aspect-[3/2] bg-[var(--marilo-soft-sage)]">
                  {r.cover_image && <img src={r.cover_image} alt={r.title} className="w-full h-full object-cover" />}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display text-2xl text-black tracking-wide mb-2">{r.title.toUpperCase()}</h3>
                  {r.description && <p className="text-sm text-black/70 mb-4 line-clamp-3 flex-1">{r.description}</p>}
                  <a href={`${API}/recipes/${r.id}`} target="_blank" rel="noreferrer" onClick={async (e) => {
                    e.preventDefault();
                    api.post("/track", { type: "recipe_download", ref_id: r.id }).catch(() => {});
                    const res = await api.get(`/recipes/${r.id}`);
                    const a = document.createElement("a");
                    a.href = res.data.pdf_data;
                    a.download = `${r.title}.pdf`;
                    a.click();
                  }} data-testid={`recipe-download-btn-${idx + 1}`} className="inline-flex items-center gap-2 text-[var(--marilo-coral)] text-xs uppercase tracking-wider font-semibold hover:gap-3 transition self-start">
                    Descargar PDF <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
            {recipes.length === 0 && (
              <div className="sm:col-span-2 lg:col-span-3 bg-white py-16 px-8 text-center">
                <p className="font-display text-2xl tracking-wide text-black/70">RECETAS PRÓXIMAMENTE…</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* GALLERY — sage */}
      <section id="gallery" data-testid="gallery-section" className="bg-[var(--marilo-sage)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 py-20 sm:py-28">
          <div className="text-center mb-12">
            <p className="tracking-[0.4em] text-xs text-black/70 font-semibold uppercase">— Galería —</p>
            <h2 className="font-display text-5xl sm:text-7xl text-black mt-3 tracking-wide">MOMENTOS EN MARILÓ</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            {gallery.map((g, idx) => (
              <motion.div key={g.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.06 }} className={`overflow-hidden bg-white ${idx % 5 === 0 ? "row-span-2 aspect-[3/4] md:aspect-[3/5]" : "aspect-square"}`}>
                <img src={g.image_url} alt={g.caption} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
            ))}
            {gallery.length === 0 && (
              <div className="col-span-full bg-white py-16 px-8 text-center">
                <p className="font-display text-2xl tracking-wide text-black/70">SUBE LAS PRIMERAS FOTOS DESDE EL PANEL ADMIN</p>
              </div>
            )}
          </div>
          <div className="text-center mt-12">
            <a href={settings?.instagram_url || "#"} target="_blank" rel="noreferrer" data-testid="instagram-follow-btn" className="btn-pill bg-[var(--marilo-coral)] text-white inline-flex items-center gap-3">
              <Instagram className="w-4 h-4" />
              Síguenos {settings?.instagram_handle || "@marilobakerycoffee"}
            </a>
          </div>
        </div>
      </section>

      <SubscribeSection />

      {/* LOCATION — black */}
      <section id="location" className="bg-black text-[var(--marilo-cream)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 py-20 sm:py-28">
          <div className="text-center mb-12">
            <p className="tracking-[0.4em] text-xs text-white/60 font-semibold uppercase">— Visítanos —</p>
            <h2 className="font-display text-5xl sm:text-7xl text-[var(--marilo-coral)] mt-3 tracking-wide">VEN A TOMAR UN CAFECITO</h2>
          </div>

          <div className="grid lg:grid-cols-2">
            <div className="aspect-square lg:aspect-auto min-h-[320px] relative" data-testid="location-map">
              <iframe title="MARILÓ map" src={settings?.map_embed_url || "https://www.google.com/maps?q=Transmetropolitana+11,+San+Andres+Totoltepec,+Tlalpan,+14400+CDMX&output=embed"} className="absolute inset-0 w-full h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
            <div className="p-8 sm:p-12 flex flex-col justify-center text-black" style={{ background: "var(--marilo-soft-coral)" }} data-testid="footer-contact">
              <div className="space-y-4 text-sm sm:text-base">
                {settings?.address && (
                  <div className="flex gap-4"><MapPin className="w-5 h-5 mt-1 text-[var(--marilo-coral)] flex-shrink-0" /><p>{settings.address}</p></div>
                )}
                {settings?.hours && (
                  <div className="flex gap-4"><Clock className="w-5 h-5 mt-1 text-[var(--marilo-coral)] flex-shrink-0" /><p className="whitespace-pre-line">{settings.hours}</p></div>
                )}
                {settings?.phone && (
                  <div className="flex gap-4"><Phone className="w-5 h-5 mt-1 text-[var(--marilo-coral)] flex-shrink-0" /><a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-[var(--marilo-coral)]">{settings.phone}</a></div>
                )}
                {settings?.email && (
                  <div className="flex gap-4"><Mail className="w-5 h-5 mt-1 text-[var(--marilo-coral)] flex-shrink-0" /><a href={`mailto:${settings.email}`} className="hover:text-[var(--marilo-coral)] break-all">{settings.email}</a></div>
                )}
              </div>
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-black/15">
                {waLink && (<a href={waLink} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="w-11 h-11 bg-[var(--marilo-sage)] text-black flex items-center justify-center hover:scale-110 transition"><MessageCircle className="w-5 h-5" /></a>)}
                {settings?.instagram_url && (<a href={settings.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-11 h-11 bg-[var(--marilo-coral)] text-white flex items-center justify-center hover:scale-110 transition"><Instagram className="w-5 h-5" /></a>)}
                {settings?.facebook_url && (<a href={settings.facebook_url} target="_blank" rel="noreferrer" aria-label="Facebook" className="w-11 h-11 bg-[var(--marilo-blue)] text-black flex items-center justify-center hover:scale-110 transition"><Facebook className="w-5 h-5" /></a>)}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-5 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-display text-3xl text-[var(--marilo-coral)] tracking-wide">MARILÓ</p>
            <p className="text-[10px] tracking-widest uppercase text-white/60">© {new Date().getFullYear()} — Cafetería con un toquesito oaxaqueño</p>
          </div>
        </div>
      </section>

      {/* WHATSAPP FLOATING */}
      {waLink && (
        <motion.a href={waLink} target="_blank" rel="noreferrer" aria-label="WhatsApp" data-testid="whatsapp-floating-btn"
          initial={{ opacity: 0, scale: 0.5, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 16 }}
          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
          className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 flex items-center gap-2 bg-[#25D366] text-white pl-4 pr-5 py-3 rounded-full shadow-2xl">
          <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/15">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white/30 animate-ping" />
            <svg viewBox="0 0 32 32" className="relative w-5 h-5 fill-current" aria-hidden="true">
              <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.295-.1c-.802-.402-1.16-.769-2.07-1.629-.302-.286-.564-.524-.564-.832 0-.434.658-.864.658-1.292 0-.286-.806-1.586-1.058-1.946-.137-.198-.273-.36-.583-.36-.27 0-.486-.077-.66.094-.428.422-.943 1.118-.943 1.836 0 1.358 1.092 2.764 1.846 3.578 1.292 1.39 2.812 2.512 4.422 3.222.474.21 1.034.394 1.582.554.428.124.872.21 1.32.21.682 0 1.51-.31 1.972-.83.272-.31.418-.65.418-1.06 0-.156-.4-.342-.66-.484-.586-.318-1.422-.748-2.018-.978a.665.665 0 0 0-.246-.06z"/>
              <path d="M16.003 0C7.198 0 .003 7.197 0 16c-.001 2.815.737 5.561 2.139 7.99L0 32l8.182-2.139A15.886 15.886 0 0 0 16.003 32C24.808 32 32 24.803 32 16S24.808 0 16.003 0zm0 29.328c-2.59 0-5.122-.696-7.327-2.013l-.526-.312-5.43 1.422 1.45-5.292-.343-.546A13.337 13.337 0 0 1 2.667 16c0-7.351 5.984-13.333 13.336-13.333S29.333 8.65 29.333 16c0 7.349-5.978 13.328-13.33 13.328z"/>
            </svg>
          </span>
          <span className="hidden sm:inline text-sm font-semibold tracking-wider uppercase">WhatsApp</span>
        </motion.a>
      )}
    </div>
  );
}
