import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Instagram, MapPin, Phone, Clock, Download, Facebook, MessageCircle, Menu as MenuIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { api, API } from "@/lib/api";
import SubscribeSection from "@/components/SubscribeSection";

const LOGO_IMG = "https://customer-assets.emergentagent.com/job_cafe-gallery-store/artifacts/06brbr54_Marilo.png";
// Hero right-side image (coffee heart + brown bag)
const HERO_IMG = "https://customer-assets.emergentagent.com/job_cafe-gallery-store/artifacts/x7jspku1_CAFE%20CON%20CORAZO%CC%81N.jpeg";
// Round portrait of Fer
const FER_IMG = "https://customer-assets.emergentagent.com/job_cafe-gallery-store/artifacts/71m5gneu_Fer%20BONITA.jpeg";

export default function HomePage() {
  const [menu, setMenu] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const openLightbox = (i) => setLightboxIdx(i);
  const closeLightbox = () => setLightboxIdx(null);
  const nextLightbox = () => setLightboxIdx((i) => (i === null ? null : (i + 1) % gallery.length));
  const prevLightbox = () => setLightboxIdx((i) => (i === null ? null : (i - 1 + gallery.length) % gallery.length));

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") nextLightbox();
      else if (e.key === "ArrowLeft") prevLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, gallery.length]);

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
  const waLink = waValid ? `https://wa.me/${waNumber}?text=${encodeURIComponent("¡Hola MARILÓ! Quisiera más información.")}` : null;
  const waTiendita = waValid ? `https://wa.me/${waNumber}?text=${encodeURIComponent("Hola, quiero comprar de la tiendita.")}` : null;

  const navLinks = [
    { id: "menu", l: "Menú" },
    { id: "desayunos", l: "Desayunos" },
    { id: "tiendita", l: "Tiendita" },
    { id: "gallery", l: "Galería" },
    { id: "recetas", l: "Estante" },
    { id: "location", l: "Visítanos" },
  ];

  return (
    <div className="relative">
      {/* NAV — dark green header */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[var(--marilo-nav)] text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-10 py-3 flex items-center justify-between">
          <button
            onClick={() => scrollTo("hero")}
            aria-label="Inicio"
            data-testid="nav-home"
            className="flex items-center"
          >
            <img src={LOGO_IMG} alt="MARILÓ" className="w-14 h-14 sm:w-16 sm:h-16 object-contain" />
          </button>
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                data-testid={`nav-${n.id}`}
                className="font-script text-xl lg:text-2xl text-white hover:text-[var(--marilo-yellow)] transition"
              >
                {n.l}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 -mr-2 text-white"
              aria-label="Menú"
              data-testid="mobile-menu-btn"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-[var(--marilo-green-dark)]"
            >
              <div className="px-5 py-3 flex flex-col">
                {navLinks.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => scrollTo(m.id)}
                    className="text-left py-3 border-b border-white/10 font-abril text-2xl text-white"
                  >
                    {m.l}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO — green left col + image right col */}
      <section id="hero" className="bg-[var(--marilo-green)] text-white pt-20 sm:pt-24">
        <div className="grid grid-cols-2 min-h-[calc(100vh-5rem)]">
          <div className="flex flex-col items-center justify-center px-4 sm:px-8 lg:px-12 py-10 sm:py-20 text-center">
            <img
              src={LOGO_IMG}
              alt="MARILÓ"
              data-testid="hero-logo"
              className="w-28 sm:w-44 lg:w-60 h-auto select-none"
              draggable="false"
            />
            <h1 className="font-script text-3xl sm:text-5xl lg:text-7xl text-[var(--marilo-yellow)] mt-6 sm:mt-10 leading-tight" data-testid="hero-title">
              Toma un cafecito
            </h1>
            <p className="font-body text-sm sm:text-lg lg:text-xl text-white/90 mt-3 sm:mt-4 italic">
              y quédate un ratito
            </p>
          </div>
          <div className="relative min-h-[320px] lg:min-h-[auto]">
            <img src={HERO_IMG} alt="Café en MARILÓ" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* INTRO — soft mint */}
      <section className="bg-[var(--marilo-mint)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 py-14 sm:py-24 grid grid-cols-2 gap-6 sm:gap-12 lg:gap-16 items-center">
          <div className="text-left">
            <h2 className="font-script text-2xl sm:text-4xl lg:text-6xl text-[var(--marilo-pink)] leading-tight">
              Aquí comes rico y bonito.
            </h2>
            <p className="font-body text-sm sm:text-base lg:text-lg text-black/80 mt-4 sm:mt-6 leading-relaxed max-w-xl">
              Cocina con toquecito Oaxaqueño, café sin pretensiones desde Zacatepec Mixe. De nuestro horno; pan con masa madre, panqués y nuestro famoso Pay de Manzana.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-36 h-36 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-xl">
              <img src={FER_IMG} alt="Fer, hecha a mano" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* MENÚ */}
      <section id="menu" data-testid="menu-section" className="bg-[var(--marilo-cream)]">
        <div className="max-w-5xl mx-auto px-5 sm:px-10 py-16 sm:py-24">
          <h2 className="font-script text-5xl sm:text-7xl text-[var(--marilo-pink)] text-center">
            Menú
          </h2>

          {/* ARMA TU PACK DE COMIDA — llamativo, arriba */}
          <div data-testid="combo-sopa-bebida" className="mt-8 sm:mt-12 rounded-2xl overflow-hidden shadow-lg max-w-3xl mx-auto">
            <div className="bg-[var(--marilo-pink)] text-white px-5 sm:px-8 py-5 sm:py-6 flex flex-col sm:flex-row items-center sm:items-stretch gap-3 sm:gap-6">
              <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-start justify-center gap-3 sm:gap-1 text-center sm:text-left sm:border-r-2 sm:border-white/30 sm:pr-6">
                <p className="font-script text-2xl sm:text-4xl text-[var(--marilo-yellow)] leading-none">
                  Pack Comida
                </p>
                <p className="font-body font-bold text-2xl sm:text-4xl text-white leading-none">+$87</p>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="font-body font-bold uppercase tracking-wider text-xs sm:text-sm text-[var(--marilo-yellow)]">
                  Incluye
                </p>
                <p className="font-body text-xs sm:text-sm text-white/95 mt-1 leading-snug">
                  Sopa 225 ml + bebida (sodas, agua mineral, naranjada, limonada o agua embotellada). Agrégalo a cualquier platillo.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 space-y-14">
            {categories.filter((c) => !["desayunos", "oaxaqueños", "oaxaquenos"].includes(c.toLowerCase())).map((cat) => {
              const items = menu.filter((m) => m.category === cat && m.available);
              return (
                <div key={cat} data-testid={`menu-category-${cat.toLowerCase().replace(/[\s&]+/g, "-")}`}>
                  <h3 className="font-script text-3xl sm:text-4xl text-[var(--marilo-green)] cat-underline mb-6">
                    {cat}
                  </h3>
                  <ul className="divide-y divide-black/5">
                    {items.map((item) => (
                      <li key={item.id} className="py-4 flex items-start gap-6">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-body font-semibold uppercase tracking-wider text-black text-[0.95rem] sm:text-base">
                            {item.name}
                          </h4>
                          {item.description && (
                            <p className="font-body text-sm sm:text-base text-black/65 mt-1 leading-snug">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <span className="font-body font-semibold text-base sm:text-lg text-[var(--marilo-pink)] whitespace-nowrap">
                          {item.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {menu.length === 0 && <p className="text-black/60 italic text-center py-12">La carta llegará pronto…</p>}
          </div>

          {waLink && (
            <div className="text-center mt-14">
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Hola MARILÓ, quiero ordenar.")}`}
                target="_blank"
                rel="noreferrer"
                data-testid="menu-whatsapp"
                className="btn-pill bg-[var(--marilo-pink)] text-white inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Pídenos por WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>

      {/* DESAYUNOS — datos editables desde admin (categorías: Desayunos, Oaxaqueños) */}
      <section id="desayunos" data-testid="desayunos-section" className="bg-[var(--marilo-mint-light)]">
        <div className="max-w-5xl mx-auto px-5 sm:px-10 py-16 sm:py-24">
          <h2 className="font-script text-5xl sm:text-7xl text-[var(--marilo-pink)] text-center">
            Desayunos
          </h2>

          {/* ARMA TU PACK DE DESAYUNO — llamativo, arriba */}
          <div data-testid="combo-desayuno" className="mt-8 sm:mt-12 rounded-2xl overflow-hidden shadow-lg max-w-3xl mx-auto">
            <div className="bg-[var(--marilo-pink)] text-white px-5 sm:px-8 py-5 sm:py-6 flex flex-col sm:flex-row items-center sm:items-stretch gap-3 sm:gap-6">
              <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-start justify-center gap-3 sm:gap-1 text-center sm:text-left sm:border-r-2 sm:border-white/30 sm:pr-6">
                <p className="font-script text-2xl sm:text-4xl text-[var(--marilo-yellow)] leading-none">
                  Pack Desayuno
                </p>
                <p className="font-body font-bold text-2xl sm:text-4xl text-white leading-none">+$65</p>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="font-body font-bold uppercase tracking-wider text-xs sm:text-sm text-[var(--marilo-yellow)]">
                  Incluye
                </p>
                <p className="font-body text-xs sm:text-sm text-white/95 mt-1 leading-snug">
                  Fruta del día, Café (Americano CH 12 oz o Infusión) y del día. Cambia tu café a Latte o Cappuccino por $15.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 space-y-14">
            {["Desayunos", "Oaxaqueños"].map((cat) => {
              const items = menu.filter((m) => m.category.toLowerCase() === cat.toLowerCase() && m.available);
              if (items.length === 0) return null;
              return (
                <div key={cat} data-testid={`desayunos-category-${cat.toLowerCase()}`}>
                  <h3 className="font-script text-3xl sm:text-4xl text-[var(--marilo-green)] cat-underline mb-6">
                    {cat}
                  </h3>
                  <ul className="divide-y divide-black/5">
                    {items.map((item) => (
                      <li key={item.id} className="py-4 flex items-start gap-6">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-body font-semibold uppercase tracking-wider text-black text-[0.95rem] sm:text-base">
                            {item.name}
                          </h4>
                          {item.description && (
                            <p className="font-body text-sm sm:text-base text-black/65 mt-1 leading-snug">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <span className="font-body font-semibold text-base sm:text-lg text-[var(--marilo-pink)] whitespace-nowrap">
                          {item.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Adicionales */}
          <div className="mt-10 bg-white/70 rounded-xl p-6 sm:p-7">
            <h4 className="font-body font-semibold uppercase tracking-wider text-[var(--marilo-green)] text-sm mb-3">
              Adicionales
            </h4>
            <ul className="font-body text-sm sm:text-base text-black/80 space-y-1">
              <li>Chorizo Oaxaqueño 80gr +$35</li>
              <li>Tiras Pollo 80gr +$35</li>
              <li>Tasajo 80gr +$45</li>
            </ul>
          </div>
        </div>
      </section>

      {/* TIENDITA */}
      <section id="tiendita" data-testid="tiendita-section" className="bg-[var(--marilo-mint)]">
        <div className="max-w-5xl mx-auto px-5 sm:px-10 py-16 sm:py-24">
          <h2 className="font-script text-5xl sm:text-7xl text-[var(--marilo-pink)] text-center">
            Tiendita
          </h2>

          {products.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-8 sm:gap-10 mt-12">
              {products.filter((p) => p.available).map((p) => (
                <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col" data-testid={`product-card-${p.id}`}>
                  <div className="aspect-square bg-[var(--marilo-mint-light)]">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : null}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-body font-semibold uppercase tracking-wider text-black text-base sm:text-lg">
                      {p.name}
                    </h3>
                    {p.description && (
                      <p className="font-body text-sm sm:text-base text-black/65 mt-1 leading-snug flex-1">
                        {p.description}
                      </p>
                    )}
                    <p className="font-body font-bold text-xl sm:text-2xl text-[var(--marilo-pink)] mt-3">
                      {p.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/60 rounded-xl py-14 px-8 text-center mt-10">
              <p className="font-script text-3xl text-[var(--marilo-green)]">Próximamente</p>
            </div>
          )}

          {waTiendita && (
            <div className="text-center mt-12">
              <a
                href={waTiendita}
                target="_blank"
                rel="noreferrer"
                data-testid="tiendita-whatsapp"
                className="btn-pill bg-[var(--marilo-pink)] text-white inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Pídenos por WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>

      {/* GALERÍA */}
      <section id="gallery" data-testid="gallery-section" className="bg-[var(--marilo-cream)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 py-16 sm:py-24">
          <h2 className="font-script text-5xl sm:text-7xl text-[var(--marilo-pink)] text-center mb-12">
            Galería
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[220px]">
            {gallery.map((g, idx) => {
              const tall = idx % 5 === 0;
              const wide = idx % 7 === 3;
              const span = tall ? "row-span-2" : wide ? "col-span-2" : "";
              return (
                <motion.button
                  type="button"
                  onClick={() => openLightbox(idx)}
                  data-testid={`gallery-item-${idx}`}
                  key={g.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (idx % 4) * 0.06 }}
                  className={`overflow-hidden rounded-lg bg-white relative group cursor-zoom-in focus:outline-none focus:ring-4 focus:ring-[var(--marilo-pink)] ${span}`}
                >
                  <img
                    src={g.image_url}
                    alt={g.caption}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                  {g.caption && (
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-left">
                      <p className="text-white text-xs sm:text-sm font-semibold tracking-wide uppercase">{g.caption}</p>
                    </div>
                  )}
                </motion.button>
              );
            })}
            {gallery.length === 0 && (
              <div className="col-span-full bg-white py-16 px-8 text-center">
                <p className="font-script text-2xl text-black/70">Sube las primeras fotos desde el panel admin</p>
              </div>
            )}
          </div>
          <div className="text-center mt-12">
            <a
              href={settings?.instagram_url || "#"}
              target="_blank"
              rel="noreferrer"
              data-testid="instagram-follow-btn"
              className="btn-pill bg-[var(--marilo-pink)] text-white inline-flex items-center gap-3"
            >
              <Instagram className="w-4 h-4" />
              Síguenos {settings?.instagram_handle || "@marilobakerycoffee"}
            </a>
          </div>
        </div>
      </section>

      {/* ESTANTE */}
      <section id="recetas" data-testid="recipe-shelf-section" className="bg-[var(--marilo-mint)]">
        <div className="max-w-5xl mx-auto px-5 sm:px-10 py-16 sm:py-24">
          <h2 className="font-script text-5xl sm:text-7xl text-[var(--marilo-pink)] text-center">
            Estante
          </h2>
          <p className="font-body text-base sm:text-lg text-black/70 text-center mt-3 max-w-xl mx-auto">
            Descarga nuestras recetas favoritas para preparar la magia de MARILÓ en tu cocina.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-12">
            {recipes.map((r, idx) => (
              <a
                key={r.id}
                href={`${API}/recipes/${r.id}`}
                target="_blank"
                rel="noreferrer"
                onClick={async (e) => {
                  e.preventDefault();
                  api.post("/track", { type: "recipe_download", ref_id: r.id }).catch(() => {});
                  const res = await api.get(`/recipes/${r.id}`);
                  const url = res.data.pdf_data;
                  if (url.startsWith("data:")) {
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${r.title}.pdf`;
                    a.click();
                  } else {
                    window.open(url, "_blank", "noopener,noreferrer");
                  }
                }}
                data-testid={`recipe-download-btn-${idx + 1}`}
                className="group bg-white rounded-xl overflow-hidden flex flex-col border-2 border-transparent hover:border-[var(--marilo-pink)] transition shadow-sm"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[var(--marilo-mint-light)] relative">
                  {r.cover_image ? (
                    <img
                      src={r.cover_image}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6">
                      <p className="font-script text-5xl text-[var(--marilo-pink)]/30 leading-none">Mariló</p>
                      <p className="font-body uppercase tracking-widest text-xs text-[var(--marilo-green)]/60 mt-3">Receta</p>
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-body font-semibold uppercase tracking-wider text-black text-base leading-tight">
                    {r.title}
                  </h3>
                  {r.description && (
                    <p className="font-body text-sm text-black/60 mt-2 leading-snug flex-1">
                      {r.description}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-2 text-[var(--marilo-pink)] text-xs uppercase tracking-wider font-semibold mt-4 group-hover:gap-3 transition">
                    Descargar PDF <Download className="w-4 h-4" />
                  </span>
                </div>
              </a>
            ))}
            {recipes.length === 0 && (
              <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-xl py-16 px-8 text-center">
                <p className="font-script text-3xl text-black/70">Recetas próximamente…</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <SubscribeSection />

      {/* VISÍTANOS — green */}
      <section id="location" className="bg-[var(--marilo-green)] text-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-10 py-16 sm:py-24">
          <h2 className="font-body font-bold italic text-5xl sm:text-7xl text-[var(--marilo-yellow)] text-center">
            Visítanos
          </h2>

          <div className="text-center mt-10 space-y-3">
            {settings?.hours && (
              <p className="font-body font-bold text-2xl sm:text-3xl text-[var(--marilo-yellow)]">
                Horarios: {settings.hours}
              </p>
            )}
            {settings?.phone && (
              <p className="font-body text-base sm:text-lg">
                WhatsApp:{" "}
                <a
                  href={waLink || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[var(--marilo-yellow)] underline-offset-4 hover:underline"
                >
                  {settings.phone.replace(/^\+52\s*/, "")}
                </a>
              </p>
            )}
            {settings?.address && (
              <p className="font-body text-base sm:text-lg">
                {settings.address}
              </p>
            )}
          </div>

          <div className="mt-10 rounded-xl overflow-hidden aspect-[16/9] max-w-4xl mx-auto" data-testid="location-map">
            <iframe
              title="MARILÓ map"
              src={settings?.map_embed_url || "https://www.google.com/maps?q=Transmetropolitana+11,+San+Andres+Totoltepec,+Tlalpan,+14400+CDMX&output=embed"}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="text-center mt-10 flex items-center justify-center gap-6 flex-wrap">
            {settings?.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="font-body text-[var(--marilo-yellow)] hover:text-white inline-flex items-center gap-2"
              >
                <Instagram className="w-5 h-5" />
                Instagram {settings.instagram_handle || "@marilobakerycoffee"}
              </a>
            )}
            {settings?.facebook_url && (
              <>
                <span className="hidden sm:inline text-white/40">|</span>
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-body text-[var(--marilo-yellow)] hover:text-white inline-flex items-center gap-2"
                >
                  <Facebook className="w-5 h-5" />
                  Facebook @marilobakerycoffee
                </a>
              </>
            )}
          </div>
        </div>

        <div className="bg-[var(--marilo-green-dark)]">
          <div className="max-w-7xl mx-auto px-5 sm:px-10 py-6 text-center">
            <p className="font-body text-xs sm:text-sm tracking-wide text-white/70">
              © {new Date().getFullYear()} MARILÓ — {settings?.hours || "Martes a Domingo de 13:30 a 21:00 hrs"}
            </p>
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxIdx !== null && gallery[lightboxIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 sm:p-8"
            onClick={closeLightbox}
            data-testid="gallery-lightbox"
          >
            <button
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              aria-label="Cerrar"
              data-testid="lightbox-close"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center rounded-full backdrop-blur-md transition"
            >
              <X className="w-6 h-6" />
            </button>
            {gallery.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
                  aria-label="Anterior"
                  data-testid="lightbox-prev"
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-white/10 hover:bg-white/25 text-white flex items-center justify-center rounded-full backdrop-blur-md transition"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
                  aria-label="Siguiente"
                  data-testid="lightbox-next"
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-white/10 hover:bg-white/25 text-white flex items-center justify-center rounded-full backdrop-blur-md transition"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}
            <motion.div
              key={gallery[lightboxIdx].id}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[88vh] w-full flex flex-col items-center"
            >
              <img
                src={gallery[lightboxIdx].image_url}
                alt={gallery[lightboxIdx].caption}
                className="max-w-full max-h-[80vh] object-contain shadow-2xl rounded-lg"
              />
              {gallery[lightboxIdx].caption && (
                <p className="mt-4 text-white/90 font-script text-xl sm:text-2xl text-center px-6">
                  {gallery[lightboxIdx].caption}
                </p>
              )}
              <p className="mt-1 text-white/40 text-[10px] tracking-[0.3em] uppercase">
                {lightboxIdx + 1} / {gallery.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WHATSAPP FLOATING */}
      {waLink && (
        <motion.a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          data-testid="whatsapp-floating-btn"
          initial={{ opacity: 0, scale: 0.5, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 16 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 flex items-center gap-2 bg-[#25D366] text-white pl-4 pr-5 py-3 rounded-full shadow-2xl"
        >
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
