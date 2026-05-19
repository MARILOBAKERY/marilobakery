import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Instagram, MapPin, Phone, Clock, Mail, Download, ArrowRight, ChevronDown, Facebook, MessageCircle, Menu as MenuIcon, X } from "lucide-react";
import { api, API } from "@/lib/api";
import SubscribeSection from "@/components/SubscribeSection";
import { Blob1, Blob2, Squiggle, SquiggleLoop, Dots, Leaf, Flower, Sun, ScribblePattern } from "@/components/folk/FolkArt";

const HERO_IMG = "https://static.prod-images.emergentagent.com/jobs/2c8c7351-1d32-4d6c-aa89-3bc9598401bf/images/b1540473a07df519af6283012d2adb0c5225f0e576585d639754d42ee6aa120f.png";
const RECIPE_BG = "https://static.prod-images.emergentagent.com/jobs/2c8c7351-1d32-4d6c-aa89-3bc9598401bf/images/14458c4bd34f6c40460550bddc655862e80e27194821d4d5eb5d7b9cd72d109b.png";

// 4 colors rotating per category
const CAT_COLORS = ["#F5C9CD", "#D5E5EA", "#DDE7CC", "#FFEFA0"];
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
    <div className="relative overflow-x-clip">
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

      {/* HERO */}
      <section id="hero" className="relative pt-24 sm:pt-28 pb-16 sm:pb-24 bg-[var(--marilo-cream)]">
        <Blob1 className="absolute top-32 -left-10 w-56 opacity-60" color="#F5C9CD" />
        <Blob2 className="absolute bottom-10 -right-10 w-72 opacity-50" color="#D5E5EA" />
        <Blob1 className="absolute top-44 right-20 w-28 opacity-70 rotate-12" color="#fdda25" />
        <Blob2 className="absolute bottom-40 left-16 w-36 opacity-50" color="#ADC388" />
        <Squiggle className="absolute top-20 right-1/4 w-32 opacity-90" color="#ADC388" />
        <Squiggle className="absolute bottom-32 left-1/4 w-28 opacity-80" color="#fdda25" />
        <Flower className="absolute top-44 left-1/4 w-10 opacity-90" />
        <Dots className="absolute bottom-20 right-1/3 w-20 opacity-70" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-10 text-center">
          <p className="tracking-[0.4em] text-[11px] sm:text-xs text-black/60 mb-3 font-semibold uppercase">Cafetería con un toquesito Oaxaqueño</p>
          <h1 className="font-display text-[5rem] sm:text-[9rem] lg:text-[13rem] leading-[0.85] text-[var(--marilo-coral)] tracking-wide" data-testid="hero-title">
            MARILÓ
          </h1>
          <Squiggle className="mx-auto w-40 mt-2" color="#E27282" />
          <p className="font-script text-3xl sm:text-4xl lg:text-5xl mt-6 max-w-3xl mx-auto leading-tight text-black/85">
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

        {/* Photo card floating */}
        <div className="relative z-10 mt-12 sm:mt-16 max-w-5xl mx-auto px-5 sm:px-10">
          <Blob1 className="absolute -top-8 -left-8 w-32 opacity-90" color="#fdda25" />
          <Blob2 className="absolute -bottom-8 -right-8 w-40 opacity-80" color="#ADC388" />
          <div className="soft-card overflow-hidden relative">
            <div className="grid sm:grid-cols-5">
              <div className="sm:col-span-3 aspect-[4/3] sm:aspect-auto">
                <img src={HERO_IMG} alt="MARILÓ" className="w-full h-full object-cover" />
              </div>
              <div className="sm:col-span-2 p-7 sm:p-10 flex flex-col justify-center relative" style={{ background: "var(--marilo-soft-coral)" }}>
                <Flower className="absolute top-4 right-4 w-12 opacity-90" color="#fdda25" />
                <Dots className="absolute bottom-4 right-6 w-16 opacity-50" color="#E27282" />
                <h3 className="font-display text-3xl sm:text-4xl text-black tracking-wide mb-3">BIENVENIDA</h3>
                <p className="text-sm leading-relaxed">
                  Un rincón tierno donde el café, la repostería y la cocina oaxaqueña se encuentran. Pasa, siéntate y respira: ya estás en casa.
                </p>
                <Squiggle className="w-24 mt-4" color="#8FBAC5" />
              </div>
            </div>
          </div>
        </div>

        <button onClick={() => scrollTo("menu")} className="block mx-auto mt-12 text-black/50 hover:text-black animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </button>
      </section>

      {/* Single color band */}
      <div className="bg-[var(--marilo-coral)] text-white py-5 text-center relative overflow-hidden">
        <Flower className="absolute top-1/2 -translate-y-1/2 left-8 w-8 opacity-90" color="#fdda25"/>
        <Flower className="absolute top-1/2 -translate-y-1/2 right-8 w-8 opacity-90" color="#fdda25"/>
        <p className="font-display tracking-[0.3em] text-base sm:text-lg">— HECHO EN OAXACA CON CARIÑO —</p>
      </div>

      {/* MENU */}
      <section id="menu" data-testid="menu-section" className="py-16 sm:py-24 bg-[var(--marilo-cream)] relative overflow-hidden">
        <Blob1 className="absolute top-20 -right-10 w-60 opacity-40" color="#ADC388" />
        <Blob2 className="absolute top-1/3 -left-16 w-72 opacity-30" color="#fdda25" />
        <Blob1 className="absolute bottom-40 -right-20 w-80 opacity-25" color="#E27282" />
        <Leaf className="absolute top-32 left-8 w-12 opacity-80 rotate-[20deg]" />
        <Flower className="absolute top-1/2 right-10 w-12 opacity-90" color="#fdda25"/>
        <Squiggle className="absolute top-1/3 right-1/4 w-28 opacity-60" color="#8FBAC5"/>
        <Dots className="absolute bottom-32 left-12 w-20 opacity-50"/>

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-10">
          <div className="text-center mb-12 sm:mb-16">
            <p className="tracking-[0.4em] text-xs text-black/60 font-semibold uppercase">— Nuestra carta —</p>
            <h2 className="font-display text-5xl sm:text-7xl text-[var(--marilo-coral)] mt-3 tracking-wide">
              SABORES QUE ABRAZAN
            </h2>
            <Squiggle className="mx-auto w-32 mt-2" color="#E27282" />
            <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-black/70">
              Comida con corazón, café especial y repostería casera. Auténticamente oaxaqueña.
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {categories.map((cat, ci) => {
              const items = menu.filter((m) => m.category === cat && m.available);
              const bg = CAT_COLORS[ci % 4];
              const accent = CAT_ACCENTS[ci % 4];
              return (
                <motion.div
                  key={cat}
                  data-testid={`menu-category-${cat.toLowerCase().replace(/[\s&]+/g, "-")}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  className="tinted-card p-6 sm:p-10 relative overflow-hidden"
                  style={{ background: bg }}
                >
                  {ci % 4 === 0 && <Flower className="absolute -top-2 -right-2 w-16 opacity-90 rotate-12" color="#fdda25"/>}
                  {ci % 4 === 1 && <Leaf className="absolute -top-2 right-4 w-12 opacity-90 rotate-12"/>}
                  {ci % 4 === 2 && <Squiggle className="absolute top-4 right-4 w-24 opacity-70" color="#E27282"/>}
                  {ci % 4 === 3 && <Dots className="absolute top-4 right-4 w-16 opacity-60"/>}
                  <div className="flex items-baseline gap-5 mb-6 relative">
                    <h3 className="font-display text-3xl sm:text-5xl leading-none tracking-wide" style={{ color: accent }}>{cat.toUpperCase()}</h3>
                    <span className="flex-1 h-px bg-black/20" />
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-5">
                    {items.map((item) => (
                      <li key={item.id} className="flex items-baseline gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="font-semibold text-sm sm:text-base text-black">{item.name}</span>
                            <span className="flex-1 border-b border-dotted border-black/30 translate-y-[-3px]" />
                            <span className="font-bold text-sm sm:text-base text-black whitespace-nowrap">{item.price}</span>
                          </div>
                          {item.description && <p className="text-xs sm:text-sm text-black/60 mt-1 leading-snug">{item.description}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
            {menu.length === 0 && <p className="text-black/60 italic text-center">La carta llegará pronto…</p>}
          </div>
        </div>
      </section>

      {/* TIENDITA — Próximamente */}
      <section id="tiendita" data-testid="tiendita-section" className="py-16 sm:py-24 bg-white relative overflow-hidden">
        <ScribblePattern className="absolute inset-0 w-full h-full opacity-40" />
        <Blob1 className="absolute top-10 -left-10 w-56 opacity-70" color="#fdda25" />
        <Blob2 className="absolute top-1/2 -right-10 w-72 opacity-50" color="#F5C9CD" />
        <Blob1 className="absolute -bottom-10 left-1/4 w-48 opacity-60" color="#8FBAC5" />
        <Flower className="absolute top-1/4 right-1/4 w-14 opacity-90" color="#E27282"/>
        <Sun className="absolute bottom-1/4 left-12 w-20 opacity-80"/>
        <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-10 text-center">
          <Flower className="mx-auto w-16 mb-4" />
          <p className="tracking-[0.4em] text-xs text-black/60 font-semibold uppercase">— Tiendita —</p>
          <h2 className="font-display text-6xl sm:text-8xl text-[var(--marilo-coral)] mt-3 tracking-wide">PRÓXIMAMENTE</h2>
          <Squiggle className="mx-auto w-40 mt-2" color="#ADC388" />
          <p className="mt-6 max-w-xl mx-auto text-sm sm:text-base text-black/75">
            Pronto encontrarás aquí nuestros productos artesanales para llevar a casa: granos de café, tazas, mermeladas, miel y más sorpresitas hechas con cariño en MARILÓ.
          </p>
          {waLink && (
            <a href={waLink} target="_blank" rel="noreferrer" className="btn-pill bg-[var(--marilo-sage)] text-black inline-flex items-center gap-2 mt-8" data-testid="tiendita-whatsapp">
              Avísame cuando esté lista <MessageCircle className="w-4 h-4" />
            </a>
          )}
        </div>
      </section>

      {/* RECETAS */}
      <section id="recetas" data-testid="recipe-shelf-section" className="py-16 sm:py-24 bg-[var(--marilo-cream)] relative overflow-hidden">
        <Blob2 className="absolute -top-10 right-8 w-60 opacity-40" color="#F5C9CD" />
        <Blob1 className="absolute top-1/2 -left-16 w-72 opacity-30" color="#ADC388" />
        <Blob2 className="absolute bottom-10 right-1/4 w-40 opacity-50" color="#fdda25" />
        <Squiggle className="absolute top-32 left-1/3 w-32 opacity-70" color="#E27282"/>
        <Dots className="absolute top-1/2 right-12 w-20 opacity-60"/>
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-10">
          <div className="text-center mb-10 sm:mb-14">
            <p className="tracking-[0.4em] text-xs text-black/60 font-semibold uppercase">— Estantería —</p>
            <h2 className="font-display text-5xl sm:text-7xl text-[var(--marilo-coral)] mt-3 tracking-wide">RECETAS DE LA CASA</h2>
            <Squiggle className="mx-auto w-32 mt-2" color="#8FBAC5" />
            <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-black/70">
              Descarga nuestras recetas favoritas para preparar la magia de MARILÓ en tu cocina.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 relative">
            {recipes.map((r, idx) => (
              <div key={r.id} className="soft-card overflow-hidden flex flex-col relative">
                <div className="aspect-[3/2] bg-[var(--marilo-soft-sage)]">
                  {r.cover_image ? <img src={r.cover_image} alt={r.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Leaf className="w-14" /></div>}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display text-2xl text-black tracking-wide mb-2">{r.title.toUpperCase()}</h3>
                  {r.description && <p className="text-sm text-black/65 mb-4 line-clamp-3 flex-1">{r.description}</p>}
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
              <div className="sm:col-span-2 lg:col-span-3 soft-card p-12 text-center text-black/60 italic flex flex-col items-center gap-3">
                <Leaf className="w-12 opacity-80" />
                <span className="font-display text-2xl tracking-wide">RECETAS PRÓXIMAMENTE…</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" data-testid="gallery-section" className="py-16 sm:py-24 bg-white relative overflow-hidden">
        <Blob1 className="absolute top-20 -left-20 w-72 opacity-30" color="#8FBAC5" />
        <Blob2 className="absolute bottom-10 -right-10 w-72 opacity-40" color="#fdda25" />
        <Blob1 className="absolute top-1/2 right-1/4 w-32 opacity-60 rotate-45" color="#E27282" />
        <SquiggleLoop className="absolute top-32 right-8 w-24 opacity-80" />
        <Flower className="absolute bottom-32 left-12 w-12 opacity-90" color="#fdda25"/>
        <Dots className="absolute top-1/3 left-1/4 w-20 opacity-60"/>
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-10">
          <div className="text-center mb-10 sm:mb-14">
            <p className="tracking-[0.4em] text-xs text-black/60 font-semibold uppercase">— Galería —</p>
            <h2 className="font-display text-5xl sm:text-7xl text-[var(--marilo-coral)] mt-3 tracking-wide">MOMENTOS EN MARILÓ</h2>
            <Squiggle className="mx-auto w-32 mt-2" color="#fdda25" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            {gallery.map((g, idx) => (
              <motion.div key={g.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.06 }} className={`overflow-hidden soft-card ${idx % 5 === 0 ? "row-span-2 aspect-[3/4] md:aspect-[3/5]" : "aspect-square"}`}>
                <img src={g.image_url} alt={g.caption} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
            ))}
            {gallery.length === 0 && (
              <div className="col-span-full soft-card p-12 text-center italic flex flex-col items-center gap-3">
                <Flower className="w-14"/>
                <span className="font-display text-2xl text-black/70 tracking-wide">SUBE LAS PRIMERAS FOTOS DESDE EL PANEL ADMIN</span>
              </div>
            )}
          </div>
          <div className="text-center mt-10 sm:mt-14">
            <a href={settings?.instagram_url || "#"} target="_blank" rel="noreferrer" data-testid="instagram-follow-btn" className="btn-pill bg-[var(--marilo-coral)] text-white inline-flex items-center gap-3">
              <Instagram className="w-4 h-4" />
              Síguenos {settings?.instagram_handle || "@marilobakerycoffee"}
            </a>
          </div>
        </div>
      </section>

      <SubscribeSection />

      {/* LOCATION + FOOTER */}
      <section id="location" className="bg-[var(--marilo-cream)] relative overflow-hidden">
        <Blob1 className="absolute top-20 -left-10 w-60 opacity-30" color="#fdda25" />
        <Blob2 className="absolute bottom-20 -right-10 w-72 opacity-40" color="#ADC388" />
        <Flower className="absolute top-32 right-1/4 w-12 opacity-90" color="#E27282"/>
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-10 py-16 sm:py-24">
          <div className="text-center mb-10 sm:mb-14">
            <p className="tracking-[0.4em] text-xs text-black/60 font-semibold uppercase">— Visítanos —</p>
            <h2 className="font-display text-5xl sm:text-7xl text-[var(--marilo-coral)] mt-3 tracking-wide">VEN A TOMAR UN CAFECITO</h2>
            <Squiggle className="mx-auto w-32 mt-2" color="#ADC388" />
          </div>

          <div className="soft-card overflow-hidden grid lg:grid-cols-2 relative">
            <Flower className="absolute -top-3 left-1/2 w-12 opacity-90 z-10" color="#fdda25"/>
            <div className="aspect-square lg:aspect-auto min-h-[320px] relative" data-testid="location-map">
              <iframe title="MARILÓ map" src={settings?.map_embed_url || "https://www.google.com/maps?q=Transmetropolitana+11,+San+Andres+Totoltepec,+Tlalpan,+14400+CDMX&output=embed"} className="absolute inset-0 w-full h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
            <div className="p-8 sm:p-12 flex flex-col justify-center relative" style={{ background: "var(--marilo-soft-coral)" }} data-testid="footer-contact">
              <Dots className="absolute bottom-4 right-4 w-16 opacity-50" color="#E27282"/>
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
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-black/10">
                {waLink && (<a href={waLink} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="w-11 h-11 rounded-full bg-[var(--marilo-sage)] text-black flex items-center justify-center hover:scale-110 transition"><MessageCircle className="w-5 h-5" /></a>)}
                {settings?.instagram_url && (<a href={settings.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-11 h-11 rounded-full bg-[var(--marilo-coral)] text-white flex items-center justify-center hover:scale-110 transition"><Instagram className="w-5 h-5" /></a>)}
                {settings?.facebook_url && (<a href={settings.facebook_url} target="_blank" rel="noreferrer" aria-label="Facebook" className="w-11 h-11 rounded-full bg-[var(--marilo-blue)] text-black flex items-center justify-center hover:scale-110 transition"><Facebook className="w-5 h-5" /></a>)}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 relative z-10">
          <div className="max-w-7xl mx-auto px-5 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-display text-3xl text-[var(--marilo-coral)] tracking-wide">MARILÓ</p>
            <p className="text-[10px] tracking-widest uppercase text-black/50">© {new Date().getFullYear()} — Cafetería con un toquesito oaxaqueño</p>
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
          <span className="hidden sm:inline text-sm font-semibold tracking-wider uppercase">WhatsApp</span>
        </motion.a>
      )}
    </div>
  );
}
