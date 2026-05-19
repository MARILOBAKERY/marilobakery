import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Instagram, MapPin, Phone, Clock, Mail, Download, ArrowRight, ChevronDown, Facebook, MessageCircle, Menu as MenuIcon, X } from "lucide-react";
import { api, API } from "@/lib/api";
import SubscribeSection from "@/components/SubscribeSection";
import { SacredHeart, FlamingSun, Moon, ProtectiveEye, TealLeaf, StarSparkle, Squiggle, PaintedBlob, SnakeSquiggle } from "@/components/folk/FolkArt";

const HERO_IMG = "https://static.prod-images.emergentagent.com/jobs/2c8c7351-1d32-4d6c-aa89-3bc9598401bf/images/b1540473a07df519af6283012d2adb0c5225f0e576585d639754d42ee6aa120f.png";
const RECIPE_BG = "https://static.prod-images.emergentagent.com/jobs/2c8c7351-1d32-4d6c-aa89-3bc9598401bf/images/14458c4bd34f6c40460550bddc655862e80e27194821d4d5eb5d7b9cd72d109b.png";
const MENU_IMG = "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=1200&q=80";

const CAT_BG = {
  "Especiales": "var(--marilo-soft-pink)",
  "Baguettes": "var(--marilo-soft-teal)",
  "Pizzas": "var(--marilo-yellow)",
  "Ensaladas": "var(--marilo-soft-teal)",
  "Brunch": "var(--marilo-mid-pink)",
  "Barra de Café": "var(--marilo-cream)",
  "Lattes": "var(--marilo-soft-pink)",
  "Chocolate": "var(--marilo-yellow)",
  "Tés & Tisanas": "var(--marilo-soft-teal)",
  "Frappes": "var(--marilo-mid-pink)",
  "Bebidas Frías": "var(--marilo-soft-teal)",
  "Repostería": "var(--marilo-yellow)",
};
const CAT_ACCENT = { "Especiales": "#f9557c", "Baguettes": "#21dfc8", "Pizzas": "#000", "Ensaladas": "#21dfc8", "Brunch": "#f9557c", "Barra de Café": "#f9557c", "Lattes": "#000", "Chocolate": "#000", "Tés & Tisanas": "#21dfc8", "Frappes": "#f9557c", "Bebidas Frías": "#21dfc8", "Repostería": "#f9557c" };

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

  const scrollTo = (id) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const waNumber = settings?.whatsapp ? settings.whatsapp.replace(/[^\d]/g, "") : "";
  const waValid = waNumber.length >= 8 && /[1-9]/.test(waNumber);
  const waLink = waValid ? `https://wa.me/${waNumber}?text=${encodeURIComponent("¡Hola MARILÓ! Quisiera más información.")}` : null;

  return (
    <div className="relative overflow-x-clip">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[var(--marilo-cream)]/90 backdrop-blur-md border-b border-black/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-10 py-3 flex items-center justify-between">
          <button onClick={() => scrollTo("hero")} className="font-display text-2xl sm:text-3xl tracking-wide" data-testid="nav-home">MARILÓ</button>
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
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden border-t border-black/10 bg-[var(--marilo-cream)]">
              <div className="px-5 py-3 flex flex-col text-base">
                {[{ id: "menu", l: "Carta" }, { id: "tiendita", l: "Tiendita" }, { id: "recetas", l: "Recetas" }, { id: "gallery", l: "Galería" }, { id: "suscribete", l: "Café Gratis" }, { id: "location", l: "Visítanos" }].map((m) => (
                  <button key={m.id} onClick={() => scrollTo(m.id)} className="text-left py-3 border-b border-black/10 font-display tracking-wider text-sm">{m.l}</button>
                ))}
                <Link to="/admin/login" className="py-3 text-xs uppercase tracking-widest text-black/60">Admin</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO — asymmetric bento */}
      <section id="hero" className="relative pt-20 sm:pt-24 bg-[var(--marilo-cream)]">
        {/* decorations */}
        <PaintedBlob className="hidden md:block absolute -top-10 -left-16 w-72 opacity-60 -z-0" color="#ffb3cd" />
        <PaintedBlob className="hidden md:block absolute top-32 right-8 w-56 opacity-50 -z-0" color="#b2f0e8" />
        <StarSparkle className="hidden sm:block absolute top-28 right-1/3 w-7" />
        <StarSparkle className="hidden sm:block absolute bottom-24 left-1/4 w-5" color="#f9557c" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-6 sm:gap-8 py-8 sm:py-12">
          {/* LEFT — text block on soft pink */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="lg:col-span-7 painted-card relative p-7 sm:p-12 lg:p-16 overflow-hidden" style={{ background: "var(--marilo-soft-pink)" }}>
            <SacredHeart className="absolute -top-2 -right-2 w-24 sm:w-28 rotate-[15deg]" />
            <Squiggle className="absolute top-8 left-7 w-24" color="#21dfc8" />
            <p className="font-display tracking-[0.3em] text-[11px] sm:text-xs text-black/70 mt-6">CAFETERÍA CON UN TOQUESITO OAXAQUEÑO</p>
            <h1 className="font-display text-[4.5rem] sm:text-[7rem] lg:text-[10rem] leading-[0.85] mt-3 text-black">
              MARI<span className="text-[var(--marilo-pink)]">LÓ</span>
            </h1>
            <p className="font-script text-2xl sm:text-3xl lg:text-[2.5rem] leading-snug mt-5 max-w-xl text-black/85">
              Aquí comes <span className="text-[var(--marilo-pink)]">rico y bonito</span>, te tomas un buen <span className="text-[var(--marilo-pink)]">cafecito</span> y lo acompañas con un rico <span className="text-[var(--marilo-pink)]">postrecito</span>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => scrollTo("menu")} data-testid="hero-cta-menu" className="group inline-flex items-center gap-2 bg-[var(--marilo-pink)] text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-display tracking-widest uppercase hover:bg-black transition">
                Ver la carta <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
              <button onClick={() => scrollTo("location")} className="inline-flex items-center gap-2 bg-black text-[var(--marilo-yellow)] px-6 py-3.5 rounded-full text-xs sm:text-sm font-display tracking-widest uppercase hover:bg-[var(--marilo-yellow)] hover:text-black transition">
                Cómo llegar
              </button>
            </div>
          </motion.div>

          {/* RIGHT — photo on yellow */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="lg:col-span-5 painted-card overflow-hidden relative" style={{ background: "var(--marilo-yellow)" }}>
            <img src={HERO_IMG} alt="MARILÓ" className="w-full h-full object-cover aspect-[4/5] lg:aspect-auto" />
            <FlamingSun className="absolute -top-6 -right-6 w-28 rotate-12" />
            <ProtectiveEye className="absolute bottom-4 left-4 w-24" />
          </motion.div>

          {/* DECORATIVE STRIP — full row of mini cards */}
          <div className="lg:col-span-12 grid grid-cols-3 gap-4 sm:gap-6 mt-2">
            <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} className="painted-card flex items-center gap-3 p-4 sm:p-5" style={{ background: "var(--marilo-soft-teal)" }}>
              <SacredHeart className="w-10 sm:w-12 flex-shrink-0" color="#f9557c"/>
              <div>
                <p className="font-display tracking-wider text-xs sm:text-sm">Hecho con</p>
                <p className="font-script text-2xl sm:text-3xl text-[var(--marilo-pink)] leading-none">cariñito</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="painted-card flex items-center gap-3 p-4 sm:p-5" style={{ background: "var(--marilo-mid-pink)" }}>
              <FlamingSun className="w-10 sm:w-12 flex-shrink-0" />
              <div>
                <p className="font-display tracking-wider text-xs sm:text-sm">Café de</p>
                <p className="font-script text-2xl sm:text-3xl text-black leading-none">Oaxaca</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} className="painted-card flex items-center gap-3 p-4 sm:p-5" style={{ background: "var(--marilo-yellow)" }}>
              <ProtectiveEye className="w-12 sm:w-14 flex-shrink-0" />
              <div>
                <p className="font-display tracking-wider text-xs sm:text-sm">Repostería</p>
                <p className="font-script text-2xl sm:text-3xl text-[var(--marilo-pink)] leading-none">de la casa</p>
              </div>
            </motion.div>
          </div>
        </div>

        <button onClick={() => scrollTo("menu")} className="block mx-auto mt-2 mb-6 text-black/60 hover:text-black animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </button>
      </section>

      {/* SINGLE COLOR BAND */}
      <div className="bg-[var(--marilo-pink)] text-white py-4 text-center relative">
        <SnakeSquiggle className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 w-16 sm:w-28 opacity-50" />
        <p className="font-display tracking-[0.3em] text-sm sm:text-base">— HECHO EN OAXACA CON CARIÑO —</p>
        <SnakeSquiggle className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-16 sm:w-28 opacity-50 -scale-x-100" />
      </div>

      {/* MENU — asymmetric bento per category */}
      <section id="menu" data-testid="menu-section" className="py-16 sm:py-24 bg-[var(--marilo-cream)] relative">
        <PaintedBlob className="hidden md:block absolute top-20 -right-20 w-72 opacity-40" color="#b2f0e8"/>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12 sm:mb-16 relative">
            <Moon className="hidden sm:block absolute -top-6 left-8 w-16 rotate-[-15deg]" />
            <StarSparkle className="absolute top-2 right-12 w-8" />
            <p className="font-display tracking-[0.4em] text-xs text-[var(--marilo-pink)]">— NUESTRA CARTA —</p>
            <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.9] mt-3">
              Sabores que <span className="font-script normal-case tracking-normal text-[var(--marilo-pink)] text-6xl sm:text-8xl">abrazan</span>
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-black/75">
              Comida con corazón, café especial y repostería casera. Auténticamente oaxaqueña.
            </p>
          </div>

          <div className="space-y-8 sm:space-y-12">
            {categories.map((cat, ci) => {
              const items = menu.filter((m) => m.category === cat && m.available);
              const bg = CAT_BG[cat] || "var(--marilo-soft-pink)";
              const accent = CAT_ACCENT[cat] || "#f9557c";
              const flipped = ci % 2 === 1; // alternate left/right anchoring
              const Deco = [SacredHeart, FlamingSun, ProtectiveEye, Moon, TealLeaf][ci % 5];
              return (
                <motion.div
                  key={cat}
                  data-testid={`menu-category-${cat.toLowerCase().replace(/[\s&]+/g, "-")}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.6 }}
                  className={`painted-card relative p-6 sm:p-10 lg:p-12 overflow-hidden ${flipped ? "lg:ml-12" : "lg:mr-12"}`}
                  style={{ background: bg }}
                >
                  <Deco className={`absolute ${flipped ? "-left-6" : "-right-6"} -top-6 w-24 sm:w-32 opacity-90 rotate-[8deg]`} />
                  <div className="relative">
                    <div className="flex items-baseline gap-4 mb-6 sm:mb-8">
                      <h3 className="font-display text-3xl sm:text-5xl lg:text-6xl leading-none" style={{ color: accent }}>{cat}</h3>
                      <span className="flex-1 h-[2px]" style={{ background: `repeating-linear-gradient(90deg, ${accent} 0 6px, transparent 6px 14px)` }} />
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
                </motion.div>
              );
            })}
            {menu.length === 0 && <p className="text-black/60 italic text-center">La carta llegará pronto…</p>}
          </div>
        </div>
      </section>

      {/* TIENDITA — Próximamente placeholder */}
      <section id="tiendita" data-testid="tiendita-section" className="py-16 sm:py-24 bg-[var(--marilo-soft-pink)] relative overflow-hidden">
        <PaintedBlob className="absolute -top-10 -left-10 w-72 opacity-50" color="#fdda25" />
        <PaintedBlob className="absolute bottom-0 -right-10 w-80 opacity-40" color="#21dfc8" />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center">
          <SacredHeart className="mx-auto w-28 sm:w-36 mb-6" />
          <p className="font-display tracking-[0.4em] text-xs text-[var(--marilo-pink)]">— TIENDITA —</p>
          <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.9] mt-3 mb-6">
            <span className="font-script normal-case tracking-normal text-[var(--marilo-pink)] text-6xl sm:text-8xl">Próximamente</span>
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-black/75 mb-8">
            Pronto encontrarás aquí nuestros productos artesanales para llevar a casa: granos de café, tazas, mermeladas, miel y más sorpresitas hechas con cariño en MARILÓ.
          </p>
          <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
            <StarSparkle className="w-6" />
            <Squiggle className="w-24" color="#21dfc8" />
            <StarSparkle className="w-8" color="#f9557c" />
            <Squiggle className="w-24" color="#fdda25" />
            <StarSparkle className="w-6" />
          </div>
          {waLink && (
            <a href={waLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-10 bg-[var(--marilo-pink)] text-white px-6 py-3.5 rounded-full text-xs sm:text-sm font-display tracking-widest uppercase hover:bg-black transition" data-testid="tiendita-whatsapp">
              Avísame cuando esté lista <MessageCircle className="w-4 h-4" />
            </a>
          )}
        </div>
      </section>

      {/* RECETAS */}
      <section id="recetas" data-testid="recipe-shelf-section" className="py-16 sm:py-24 bg-[var(--marilo-cream)] relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-6 sm:gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-5 painted-card relative overflow-hidden min-h-[320px]" style={{ background: "var(--marilo-mid-pink)" }}>
            <img src={RECIPE_BG} alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/60" />
            <TealLeaf className="absolute -bottom-4 -right-4 w-28 opacity-90" />
            <FlamingSun className="absolute top-4 right-4 w-16 opacity-90" />
            <div className="relative z-10 p-7 sm:p-10 h-full flex flex-col justify-end text-white">
              <p className="font-display tracking-[0.3em] text-[11px] sm:text-xs opacity-80">— ESTANTERÍA —</p>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight mb-3 mt-3">Recetas <span className="font-script normal-case text-[var(--marilo-yellow)]">de la casa</span></h2>
              <p className="max-w-sm text-sm">Descarga nuestras recetas favoritas para preparar la magia de MARILÓ en tu cocina.</p>
            </div>
          </motion.div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4 sm:gap-5">
            {recipes.map((r, idx) => (
              <div key={r.id} className="painted-card bg-white p-5 flex flex-col justify-between">
                {r.cover_image && (
                  <div className="aspect-[3/2] rounded-xl overflow-hidden mb-4">
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
                }} data-testid={`recipe-download-btn-${idx + 1}`} className="inline-flex items-center gap-2 text-[var(--marilo-pink)] text-xs sm:text-sm font-display tracking-widest uppercase hover:gap-3 transition">
                  Descargar PDF <Download className="w-4 h-4" />
                </a>
              </div>
            ))}
            {recipes.length === 0 && (
              <div className="sm:col-span-2 painted-card p-10 text-center italic flex flex-col items-center gap-3" style={{ background: "var(--marilo-soft-teal)" }}>
                <Moon className="w-12 opacity-80" />
                <span>Recetas próximamente…</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" data-testid="gallery-section" className="py-16 sm:py-24 bg-[var(--marilo-soft-teal)] relative overflow-hidden">
        <PaintedBlob className="absolute -bottom-10 left-1/4 w-72 opacity-40" color="#ffb3cd" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10 sm:mb-14 relative">
            <ProtectiveEye className="mx-auto w-20 mb-3" />
            <p className="font-display tracking-[0.4em] text-xs text-[var(--marilo-pink)]">— GALERÍA —</p>
            <h2 className="font-display text-4xl sm:text-6xl mt-3">Momentos en <span className="font-script normal-case text-[var(--marilo-pink)]">MARILÓ</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            {gallery.map((g, idx) => (
              <motion.div key={g.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.06 }} className={`overflow-hidden painted-card ${idx % 5 === 0 ? "row-span-2 aspect-[3/4] md:aspect-[3/5]" : "aspect-square"}`}>
                <img src={g.image_url} alt={g.caption} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
            ))}
            {gallery.length === 0 && (
              <div className="col-span-full painted-card bg-white p-10 text-center italic flex flex-col items-center gap-3">
                <SacredHeart className="w-14"/>
                <span>Sube las primeras fotos desde el panel admin.</span>
              </div>
            )}
          </div>
          <div className="text-center mt-10 sm:mt-14">
            <a href={settings?.instagram_url || "#"} target="_blank" rel="noreferrer" data-testid="instagram-follow-btn" className="inline-flex items-center gap-3 bg-[var(--marilo-pink)] text-white px-7 py-4 rounded-full text-xs sm:text-sm tracking-widest uppercase font-display hover:bg-black transition">
              <Instagram className="w-5 h-5" />
              Síguenos {settings?.instagram_handle || "@marilobakerycoffee"}
            </a>
          </div>
        </div>
      </section>

      <SubscribeSection />

      {/* LOCATION + FOOTER */}
      <section id="location" className="bg-black text-[var(--marilo-cream)] relative">
        <div className="grid lg:grid-cols-2">
          <div className="aspect-square lg:aspect-auto min-h-[320px] sm:min-h-[420px] relative" data-testid="location-map">
            <iframe
              title="MARILÓ map"
              src={settings?.map_embed_url || "https://www.google.com/maps?q=Transmetropolitana+11,+San+Andres+Totoltepec,+Tlalpan,+14400+CDMX&output=embed"}
              className="absolute inset-0 w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="p-8 sm:p-16 lg:p-24 flex flex-col justify-center relative" data-testid="footer-contact">
            <FlamingSun className="hidden sm:block absolute top-8 right-8 w-20 opacity-90" />
            <SacredHeart className="hidden sm:block absolute bottom-10 right-10 w-16 opacity-90" />
            <p className="font-display tracking-[0.4em] text-xs text-[var(--marilo-yellow)]">— VISÍTANOS —</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-3 mb-3 leading-tight">
              Ven a tomar un <span className="font-script normal-case text-[var(--marilo-pink)]">cafecito</span>
            </h2>
            <div className="mt-6 space-y-4 text-sm sm:text-base relative z-10">
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
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-[var(--marilo-pink)]">{settings.phone}</a>
                </div>
              )}
              {settings?.email && (
                <div className="flex gap-4">
                  <Mail className="w-5 h-5 mt-1 text-[var(--marilo-yellow)] flex-shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-[var(--marilo-pink)] break-all">{settings.email}</a>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 mt-8 pt-8 border-t border-white/20 relative z-10">
              {waLink && (
                <a href={waLink} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="w-11 h-11 rounded-full bg-[var(--marilo-yellow)] text-black flex items-center justify-center hover:scale-110 transition">
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-11 h-11 rounded-full bg-[var(--marilo-pink)] text-white flex items-center justify-center hover:scale-110 transition">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noreferrer" aria-label="Facebook" className="w-11 h-11 rounded-full bg-[var(--marilo-teal)] text-black flex items-center justify-center hover:scale-110 transition">
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
          <span className="hidden sm:inline text-sm font-display tracking-widest">WhatsApp</span>
        </motion.a>
      )}
    </div>
  );
}
