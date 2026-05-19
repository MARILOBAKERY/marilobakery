import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Instagram, MapPin, Phone, Clock, Mail, Download, ArrowRight, ChevronDown, Coffee, Facebook, MessageCircle, Menu as MenuIcon, X } from "lucide-react";
import { api, API } from "@/lib/api";
import SubscribeSection from "@/components/SubscribeSection";

const HERO_IMG = "https://static.prod-images.emergentagent.com/jobs/2c8c7351-1d32-4d6c-aa89-3bc9598401bf/images/b1540473a07df519af6283012d2adb0c5225f0e576585d639754d42ee6aa120f.png";
const RECIPE_BG = "https://static.prod-images.emergentagent.com/jobs/2c8c7351-1d32-4d6c-aa89-3bc9598401bf/images/14458c4bd34f6c40460550bddc655862e80e27194821d4d5eb5d7b9cd72d109b.png";
const MENU_IMG = "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=1200&q=80";

const CAT_COLORS = {
  "Especiales": { bg: "var(--marilo-soft-pink)", chip: "var(--marilo-pink)", chipFg: "#fff" },
  "Baguettes": { bg: "var(--marilo-soft-teal)", chip: "var(--marilo-teal)", chipFg: "#000" },
  "Pizzas": { bg: "var(--marilo-yellow)", chip: "#000", chipFg: "var(--marilo-yellow)" },
  "Ensaladas": { bg: "var(--marilo-soft-teal)", chip: "var(--marilo-teal)", chipFg: "#000" },
  "Brunch": { bg: "var(--marilo-mid-pink)", chip: "var(--marilo-pink)", chipFg: "#fff" },
  "Barra de Café": { bg: "var(--marilo-cream)", chip: "var(--marilo-pink)", chipFg: "#fff" },
  "Lattes": { bg: "var(--marilo-soft-pink)", chip: "#000", chipFg: "var(--marilo-yellow)" },
  "Chocolate": { bg: "var(--marilo-yellow)", chip: "#000", chipFg: "#fff" },
  "Tés & Tisanas": { bg: "var(--marilo-soft-teal)", chip: "var(--marilo-teal)", chipFg: "#000" },
  "Frappes": { bg: "var(--marilo-mid-pink)", chip: "var(--marilo-pink)", chipFg: "#fff" },
  "Bebidas Frías": { bg: "var(--marilo-soft-teal)", chip: "var(--marilo-teal)", chipFg: "#000" },
  "Repostería": { bg: "var(--marilo-yellow)", chip: "var(--marilo-pink)", chipFg: "#fff" },
};

export default function HomePage() {
  const [menu, setMenu] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/menu").then((r) => setMenu(r.data)),
      api.get("/gallery").then((r) => setGallery(r.data)),
      api.get("/recipes").then((r) => setRecipes(r.data)),
      api.get("/products").then((r) => setProducts(r.data)),
      api.get("/settings").then((r) => setSettings(r.data)),
    ]).catch(() => {});
  }, []);

  const categories = [...new Set(menu.map((m) => m.category))];

  const scrollTo = (id) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const waNumber = settings?.whatsapp ? settings.whatsapp.replace(/[^\d]/g, "") : "";
  const waValid = waNumber.length >= 8 && /[1-9]/.test(waNumber);
  const waLink = waValid
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent("¡Hola MARILÓ! Quisiera más información.")}`
    : null;

  return (
    <div className="relative">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[var(--marilo-cream)]/90 backdrop-blur-md border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-5 sm:px-10 py-3 flex items-center justify-between">
          <button onClick={() => scrollTo("hero")} className="font-display text-2xl sm:text-3xl tracking-wide" data-testid="nav-home">
            MARILÓ
          </button>
          <div className="hidden md:flex items-center gap-7 text-[11px] font-semibold tracking-[0.15em] uppercase">
            <button onClick={() => scrollTo("menu")} className="hover:text-[var(--marilo-pink)] transition" data-testid="nav-menu">Carta</button>
            <button onClick={() => scrollTo("tiendita")} className="hover:text-[var(--marilo-pink)] transition" data-testid="nav-shop">Tiendita</button>
            <button onClick={() => scrollTo("recetas")} className="hover:text-[var(--marilo-pink)] transition" data-testid="nav-recipes">Recetas</button>
            <button onClick={() => scrollTo("gallery")} className="hover:text-[var(--marilo-pink)] transition" data-testid="nav-gallery">Galería</button>
            <button onClick={() => scrollTo("location")} className="hover:text-[var(--marilo-pink)] transition" data-testid="nav-location">Visítanos</button>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/login" className="hidden sm:inline text-[10px] uppercase tracking-widest text-black/60 hover:text-[var(--marilo-pink)]" data-testid="nav-admin">Admin</Link>
            <button onClick={() => setMobileOpen((v) => !v)} className="md:hidden p-2 -mr-2" aria-label="Menú" data-testid="mobile-menu-btn">
              {mobileOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden border-t-2 border-black bg-[var(--marilo-cream)]">
              <div className="px-5 py-3 flex flex-col text-base">
                {[
                  { id: "menu", l: "Carta" },
                  { id: "tiendita", l: "Tiendita" },
                  { id: "recetas", l: "Recetas" },
                  { id: "gallery", l: "Galería" },
                  { id: "suscribete", l: "Café Gratis" },
                  { id: "location", l: "Visítanos" },
                ].map((m) => (
                  <button key={m.id} onClick={() => scrollTo(m.id)} className="text-left py-3 border-b border-black/15 font-display tracking-wider text-sm">{m.l}</button>
                ))}
                <Link to="/admin/login" className="py-3 text-xs uppercase tracking-widest text-black/60">Admin</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen pt-24 pb-12 sm:pt-28 sm:pb-20 overflow-hidden bg-[var(--marilo-cream)]">
        {/* Decorative blobs */}
        <div className="absolute top-32 -left-10 w-56 h-56 rounded-full bg-[var(--marilo-pink)] opacity-40 blur-2xl" />
        <div className="absolute bottom-10 -right-16 w-72 h-72 rounded-full bg-[var(--marilo-teal)] opacity-30 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-10 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="sticker mb-6 text-[11px] sm:text-xs inline-block" data-testid="hero-badge">
              ¡Toquesito Oaxaqueño!
            </motion.span>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} className="font-display text-[11px] sm:text-sm tracking-[0.3em] mb-4 text-black/70">
              CAFETERÍA CON UN TOQUESITO OAXAQUEÑO
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
              className="font-display text-[5.5rem] sm:text-[9rem] lg:text-[12rem] leading-[0.85] text-black"
              style={{ WebkitTextStroke: "0px" }}
            >
              MARI<span className="text-[var(--marilo-pink)]">LÓ</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="font-script text-2xl sm:text-3xl lg:text-4xl text-black/85 mt-4 sm:mt-6 leading-snug max-w-2xl mx-auto lg:mx-0">
              Aquí comes <span className="text-[var(--marilo-pink)]">rico y bonito</span>, te tomas un buen <span className="text-[var(--marilo-pink)]">cafecito</span> y lo acompañas con un rico <span className="text-[var(--marilo-pink)]">postrecito</span>.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <button onClick={() => scrollTo("menu")} data-testid="hero-cta-menu" className="group inline-flex items-center gap-3 bg-[var(--marilo-pink)] text-white px-7 py-4 rounded-full text-xs sm:text-sm font-display tracking-widest uppercase border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000] transition">
                Ver la carta <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => scrollTo("location")} className="inline-flex items-center gap-2 bg-[var(--marilo-yellow)] text-black px-6 py-4 rounded-full text-xs sm:text-sm font-display tracking-widest uppercase border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000] transition">
                Cómo llegar
              </button>
            </motion.div>
          </div>

          {/* Polaroid photo */}
          <motion.div initial={{ opacity: 0, rotate: -5, y: 30 }} animate={{ opacity: 1, rotate: 4, y: 0 }} transition={{ delay: 0.6, duration: 0.8, type: "spring" }} className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="bg-white p-3 sm:p-4 pb-12 sm:pb-16 border-2 border-black shadow-[12px_12px_0_0_#000] max-w-sm">
              <img src={HERO_IMG} alt="MARILÓ interior" className="w-full aspect-[4/5] object-cover" />
              <p className="font-script text-2xl text-center mt-2 text-black">¡Bienvenidos a casa!</p>
            </div>
          </motion.div>
        </div>
        <button onClick={() => scrollTo("menu")} className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-black/60 hover:text-black animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </button>
      </section>

      {/* SINGLE-COLOR BAND (replaces marquee) */}
      <div className="bg-[var(--marilo-pink)] text-white py-4 border-y-2 border-black text-center">
        <p className="font-display tracking-[0.3em] text-sm sm:text-base">— HECHO EN OAXACA CON CARIÑO —</p>
      </div>

      {/* MENU */}
      <section id="menu" data-testid="menu-section" className="py-16 sm:py-24 lg:py-32 bg-[var(--marilo-cream)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-10">
          <div className="text-center mb-12 sm:mb-16">
            <span className="sticker text-xs mb-4 inline-block">Nuestra carta</span>
            <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.9] mt-4">
              Sabores que <br className="hidden sm:inline" /><span className="font-script normal-case tracking-normal text-[var(--marilo-pink)] text-6xl sm:text-8xl">abrazan</span>
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base">
              Comida con corazón, café especial y repostería casera. <br /> Auténticamente oaxaqueña, hecha con paciencia.
            </p>
          </div>

          <div className="space-y-10 sm:space-y-14">
            {categories.map((cat) => {
              const colors = CAT_COLORS[cat] || CAT_COLORS["Barra de Café"];
              const items = menu.filter((m) => m.category === cat && m.available);
              return (
                <div key={cat} data-testid={`menu-category-${cat.toLowerCase().replace(/[\s&]+/g, "-")}`} className="vintage-card rounded-2xl p-6 sm:p-8 lg:p-10" style={{ background: colors.bg }}>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="inline-block px-4 py-1.5 rounded-full font-display tracking-[0.15em] text-xs sm:text-sm border-2 border-black" style={{ background: colors.chip, color: colors.chipFg }}>
                      {cat}
                    </span>
                    <span className="flex-1 divider-dots" />
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-5">
                    {items.map((item) => (
                      <li key={item.id} className="flex items-baseline gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="font-display tracking-wide text-base sm:text-lg text-black">{item.name}</span>
                            <span className="flex-1 border-b border-dotted border-black/30 translate-y-[-3px]" />
                            <span className="font-display text-lg sm:text-xl text-black whitespace-nowrap">{item.price}</span>
                          </div>
                          {item.description && <p className="text-xs sm:text-sm text-black/70 mt-1 leading-snug">{item.description}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {menu.length === 0 && <p className="text-black/60 italic text-center">La carta llegará pronto…</p>}
          </div>
        </div>
      </section>

      {/* TIENDITA */}
      <section id="tiendita" data-testid="tiendita-section" className="py-16 sm:py-24 lg:py-32 bg-[var(--marilo-soft-pink)] border-y-2 border-black">
        <div className="max-w-7xl mx-auto px-5 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 sm:gap-6 mb-10 sm:mb-14">
            <div>
              <span className="sticker text-xs mb-3 inline-block">Tiendita</span>
              <h2 className="font-display text-4xl sm:text-6xl mt-3">Para llevar a casa</h2>
              <p className="mt-3 max-w-lg text-sm sm:text-base">Disponibles en nuestra tienda física. Pasa a saludarnos y llévate un pedacito de MARILÓ.</p>
            </div>
            {waLink && (
              <a href={waLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[var(--marilo-teal)] text-black px-5 py-3 rounded-full text-xs uppercase tracking-widest font-display border-2 border-black shadow-[3px_3px_0_0_#000] self-start">
                Pregunta por WhatsApp <MessageCircle className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p, idx) => (
              <motion.div
                key={p.id}
                data-testid={`tiendita-item-${idx + 1}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                onViewportEnter={() => api.post("/track", { type: "product_view", ref_id: p.id }).catch(() => {})}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: idx * 0.08 }}
                className="vintage-card rounded-2xl overflow-hidden bg-white"
              >
                <div className="aspect-square overflow-hidden bg-[var(--marilo-yellow)]">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Coffee className="w-10 h-10" /></div>
                  )}
                </div>
                <div className="p-4 border-t-2 border-black">
                  <h3 className="font-display tracking-wide text-base sm:text-lg leading-tight">{p.name}</h3>
                  {p.description && <p className="text-xs text-black/70 mb-2 line-clamp-2">{p.description}</p>}
                  <div className="flex items-center justify-between mt-2">
                    {p.price && <span className="font-display text-lg text-[var(--marilo-pink)]">{p.price}</span>}
                    {!p.available && <span className="text-[10px] uppercase tracking-wider text-black/60">Agotado</span>}
                  </div>
                </div>
              </motion.div>
            ))}
            {products.length === 0 && <p className="text-black/60 italic col-span-full">Pronto, productos hechos con amor.</p>}
          </div>
        </div>
      </section>

      {/* RECETAS */}
      <section id="recetas" data-testid="recipe-shelf-section" className="py-16 sm:py-24 lg:py-32 bg-[var(--marilo-cream)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-10 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden min-h-[300px] sm:min-h-[420px] vintage-card">
            <img src={RECIPE_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-[var(--marilo-pink)]/80" />
            <div className="relative z-10 p-7 sm:p-10 h-full flex flex-col justify-end text-white">
              <span className="sticker text-xs mb-3 inline-block w-fit">Estantería</span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight mb-3">Recetas <span className="font-script normal-case text-[var(--marilo-yellow)]">de la casa</span></h2>
              <p className="max-w-sm text-sm">Descarga nuestras recetas favoritas e instructivos para preparar la magia de MARILÓ en tu cocina.</p>
            </div>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4 sm:gap-5">
            {recipes.map((r, idx) => (
              <div key={r.id} className="vintage-card bg-white rounded-2xl p-5 flex flex-col justify-between">
                {r.cover_image && (
                  <div className="aspect-[3/2] rounded-xl overflow-hidden mb-4 border-2 border-black">
                    <img src={r.cover_image} alt={r.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <h3 className="font-display tracking-wide text-xl sm:text-2xl mb-2 leading-tight">{r.title}</h3>
                  {r.description && <p className="text-sm text-black/70 mb-4 line-clamp-3">{r.description}</p>}
                </div>
                <a href={`${API}/recipes/${r.id}`} target="_blank" rel="noreferrer" onClick={async (e) => {
                  e.preventDefault();
                  api.post("/track", { type: "recipe_download", ref_id: r.id }).catch(() => {});
                  const res = await api.get(`/recipes/${r.id}`);
                  const a = document.createElement("a");
                  a.href = res.data.pdf_data;
                  a.download = `${r.title}.pdf`;
                  a.click();
                }} data-testid={`recipe-download-btn-${idx + 1}`} className="inline-flex items-center gap-2 text-[var(--marilo-pink)] text-xs sm:text-sm font-display tracking-widest uppercase hover:gap-3 transition-all">
                  Descargar PDF <Download className="w-4 h-4" />
                </a>
              </div>
            ))}
            {recipes.length === 0 && (
              <div className="sm:col-span-2 vintage-card p-10 bg-[var(--marilo-soft-teal)] rounded-2xl text-center italic">
                Recetas próximamente…
              </div>
            )}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" data-testid="gallery-section" className="py-16 sm:py-24 lg:py-32 bg-[var(--marilo-soft-teal)] border-y-2 border-black">
        <div className="max-w-7xl mx-auto px-5 sm:px-10">
          <div className="text-center mb-10 sm:mb-14">
            <span className="sticker text-xs mb-3 inline-block" style={{ background: "var(--marilo-pink)", color: "#fff" }}>Galería</span>
            <h2 className="font-display text-4xl sm:text-6xl mt-3">Momentos en <span className="font-script normal-case text-[var(--marilo-pink)]">MARILÓ</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            {gallery.map((g, idx) => (
              <motion.div key={g.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.06 }} className={`overflow-hidden rounded-xl border-2 border-black shadow-[4px_4px_0_0_#000] ${idx % 5 === 0 ? "row-span-2 aspect-[3/4] md:aspect-[3/5]" : "aspect-square"}`}>
                <img src={g.image_url} alt={g.caption} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10 sm:mt-14">
            <a
              href={settings?.instagram_url || "#"}
              target="_blank"
              rel="noreferrer"
              data-testid="instagram-follow-btn"
              className="inline-flex items-center gap-3 bg-[var(--marilo-pink)] text-white px-7 py-4 rounded-full text-xs sm:text-sm tracking-widest uppercase font-display border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-y-[-2px] transition"
            >
              <Instagram className="w-5 h-5" />
              Síguenos {settings?.instagram_handle || "@marilocafeteria"}
            </a>
          </div>
        </div>
      </section>

      <SubscribeSection />

      {/* LOCATION + FOOTER */}
      <section id="location" className="bg-black text-[var(--marilo-cream)]">
        <div className="grid lg:grid-cols-2">
          <div className="aspect-square lg:aspect-auto min-h-[300px] sm:min-h-[400px] relative" data-testid="location-map">
            <iframe
              title="MARILÓ map"
              src={settings?.map_embed_url || "https://www.google.com/maps?q=oaxaca&output=embed"}
              className="absolute inset-0 w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="p-8 sm:p-16 lg:p-24 flex flex-col justify-center" data-testid="footer-contact">
            <span className="sticker text-xs mb-3 self-start">Visítanos</span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mb-3 mt-3">Ven a tomar un <span className="font-script normal-case text-[var(--marilo-pink)]">cafecito</span></h2>
            <div className="mt-6 space-y-4 text-sm sm:text-base">
              {settings?.address && (
                <div className="flex gap-4">
                  <MapPin className="w-5 h-5 mt-1 text-[var(--marilo-yellow)] flex-shrink-0" />
                  <p className="leading-relaxed">{settings.address}</p>
                </div>
              )}
              {settings?.hours && (
                <div className="flex gap-4">
                  <Clock className="w-5 h-5 mt-1 text-[var(--marilo-yellow)] flex-shrink-0" />
                  <p className="whitespace-pre-line leading-relaxed">{settings.hours}</p>
                </div>
              )}
              {settings?.phone && (
                <div className="flex gap-4">
                  <Phone className="w-5 h-5 mt-1 text-[var(--marilo-yellow)] flex-shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-[var(--marilo-pink)]">{settings.phone}</a>
                </div>
              )}
              {settings?.email && (
                <div className="flex gap-4">
                  <Mail className="w-5 h-5 mt-1 text-[var(--marilo-yellow)] flex-shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-[var(--marilo-pink)] break-all">{settings.email}</a>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 mt-8 pt-8 border-t border-white/20">
              {waLink && (
                <a href={waLink} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="w-11 h-11 rounded-full bg-[var(--marilo-yellow)] text-black border-2 border-[var(--marilo-yellow)] flex items-center justify-center hover:bg-transparent hover:text-[var(--marilo-yellow)] transition">
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-11 h-11 rounded-full bg-[var(--marilo-pink)] text-white border-2 border-[var(--marilo-pink)] flex items-center justify-center hover:bg-transparent hover:text-[var(--marilo-pink)] transition">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noreferrer" aria-label="Facebook" className="w-11 h-11 rounded-full bg-[var(--marilo-teal)] text-black border-2 border-[var(--marilo-teal)] flex items-center justify-center hover:bg-transparent hover:text-[var(--marilo-teal)] transition">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-white/20">
          <div className="max-w-7xl mx-auto px-5 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-display text-2xl sm:text-3xl">MARILÓ</p>
            <p className="text-[10px] tracking-widest uppercase text-white/60">© {new Date().getFullYear()} — Cafetería con un toquesito oaxaqueño</p>
          </div>
        </div>
      </section>

      {/* WHATSAPP FLOATING BUTTON */}
      {waLink && (
        <motion.a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          aria-label="Escríbenos por WhatsApp"
          data-testid="whatsapp-floating-btn"
          initial={{ opacity: 0, scale: 0.5, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 16 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 flex items-center gap-2 bg-[#25D366] text-white pl-4 pr-5 py-3 rounded-full border-2 border-black shadow-[4px_4px_0_0_#000]"
        >
          <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/15">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white/30 animate-ping" />
            <svg viewBox="0 0 32 32" className="relative w-5 h-5 fill-current" aria-hidden="true">
              <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.295-.1c-.802-.402-1.16-.769-2.07-1.629-.302-.286-.564-.524-.564-.832 0-.434.658-.864.658-1.292 0-.286-.806-1.586-1.058-1.946-.137-.198-.273-.36-.583-.36-.27 0-.486-.077-.66.094-.428.422-.943 1.118-.943 1.836 0 1.358 1.092 2.764 1.846 3.578 1.292 1.39 2.812 2.512 4.422 3.222.474.21 1.034.394 1.582.554.428.124.872.21 1.32.21.682 0 1.51-.31 1.972-.83.272-.31.418-.65.418-1.06 0-.156-.4-.342-.66-.484-.586-.318-1.422-.748-2.018-.978a.665.665 0 0 0-.246-.06z"/>
              <path d="M16.003 0C7.198 0 .003 7.197 0 16c-.001 2.815.737 5.561 2.139 7.99L0 32l8.182-2.139A15.886 15.886 0 0 0 16.003 32C24.808 32 32 24.803 32 16S24.808 0 16.003 0zm0 29.328c-2.59 0-5.122-.696-7.327-2.013l-.526-.312-5.43 1.422 1.45-5.292-.343-.546A13.337 13.337 0 0 1 2.667 16c0-7.351 5.984-13.333 13.336-13.333S29.333 8.65 29.333 16c0 7.349-5.978 13.328-13.33 13.328z"/>
            </svg>
          </span>
          <span className="hidden sm:inline text-sm font-display tracking-widest">WhatsApp</span>
        </motion.a>
      )}
    </div>
  );
}
