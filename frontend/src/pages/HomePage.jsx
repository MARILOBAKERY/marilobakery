import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";
import { Instagram, MapPin, Phone, Clock, Mail, Download, ArrowRight, ChevronDown, Coffee, Facebook, MessageCircle } from "lucide-react";
import { api, API } from "@/lib/api";
import { Button } from "@/components/ui/button";

const HERO_IMG = "https://static.prod-images.emergentagent.com/jobs/2c8c7351-1d32-4d6c-aa89-3bc9598401bf/images/b1540473a07df519af6283012d2adb0c5225f0e576585d639754d42ee6aa120f.png";
const RECIPE_BG = "https://static.prod-images.emergentagent.com/jobs/2c8c7351-1d32-4d6c-aa89-3bc9598401bf/images/14458c4bd34f6c40460550bddc655862e80e27194821d4d5eb5d7b9cd72d109b.png";
const MENU_IMG = "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=1200&q=80";

export default function HomePage() {
  const [menu, setMenu] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);

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
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-between">
          <button onClick={() => scrollTo("hero")} className="font-serif-display text-2xl tracking-tight" data-testid="nav-home">MARILÓ</button>
          <div className="hidden md:flex items-center gap-8 text-sm tracking-wide uppercase">
            <button onClick={() => scrollTo("menu")} className="hover:text-primary transition-colors" data-testid="nav-menu">Carta</button>
            <button onClick={() => scrollTo("tiendita")} className="hover:text-primary transition-colors" data-testid="nav-shop">Tiendita</button>
            <button onClick={() => scrollTo("recetas")} className="hover:text-primary transition-colors" data-testid="nav-recipes">Recetas</button>
            <button onClick={() => scrollTo("gallery")} className="hover:text-primary transition-colors" data-testid="nav-gallery">Galería</button>
            <button onClick={() => scrollTo("location")} className="hover:text-primary transition-colors" data-testid="nav-location">Visítanos</button>
          </div>
          <Link to="/admin/login" className="text-xs text-muted-foreground hover:text-primary transition" data-testid="nav-admin">Admin</Link>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="MARILÓ cafe interior" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 pb-24 sm:pb-32 w-full">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }} className="text-white/90 tracking-[0.4em] uppercase text-xs sm:text-sm mb-6">
            — Cafetería de barrio
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1 }} className="font-serif-display text-white text-7xl sm:text-8xl lg:text-[10rem] leading-[0.95]">
            MARILÓ
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="text-white/85 max-w-xl mt-6 text-base sm:text-lg leading-relaxed">
            {settings?.tagline || "Café artesanal, repostería fresca y un rincón con alma bohemia para escapar del mundo."}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-10 flex items-center gap-4">
            <button onClick={() => scrollTo("menu")} data-testid="hero-cta-menu" className="group inline-flex items-center gap-3 bg-white text-foreground px-7 py-4 rounded-full text-sm tracking-wide uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              Ver la carta <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => scrollTo("location")} className="text-white/80 text-sm tracking-wide uppercase hover:text-white border-b border-white/40 pb-1 transition">Cómo llegar</button>
          </motion.div>
        </div>
        <button onClick={() => scrollTo("menu")} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/70 hover:text-white animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </button>
      </section>

      {/* MARQUEE */}
      <div className="bg-foreground text-background py-5 border-y border-foreground/10">
        <Marquee speed={40} gradient={false}>
          {["Café Artesanal", "Repostería Fresca", "Alma Bohemia", "Hecho con Cariño", "Granos de Origen"].map((t, i) => (
            <span key={i} className="font-serif-display text-2xl sm:text-3xl mx-12 italic">— {t}</span>
          ))}
        </Marquee>
      </div>

      {/* MENU */}
      <section id="menu" data-testid="menu-section" className="py-24 sm:py-32 max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="lg:sticky lg:top-32">
            <p className="text-muted-foreground uppercase tracking-[0.3em] text-xs mb-4">— Nuestra carta</p>
            <h2 className="font-serif-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] mb-6">Sabores que <em className="text-primary">abrazan</em></h2>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Cada taza, cada bocado se prepara con paciencia, café tostado en pequeños lotes y panadería horneada cada mañana.
            </p>
            <div className="mt-10 aspect-[4/3] rounded-2xl overflow-hidden">
              <img src={MENU_IMG} alt="" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="space-y-14">
            {categories.map((cat) => (
              <div key={cat} data-testid={`menu-category-${cat.toLowerCase()}`}>
                <h3 className="font-serif-display text-3xl text-primary mb-6 flex items-baseline gap-4">
                  <span>{cat}</span>
                  <span className="flex-1 divider-handdrawn" />
                </h3>
                <ul className="space-y-5">
                  {menu.filter((m) => m.category === cat && m.available).map((item) => (
                    <li key={item.id} className="flex items-baseline gap-4">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium text-lg">{item.name}</span>
                          <span className="flex-1 border-b border-dotted border-border" />
                          <span className="font-serif-display text-xl text-primary">{item.price}</span>
                        </div>
                        {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {menu.length === 0 && <p className="text-muted-foreground italic">La carta llegará pronto…</p>}
          </div>
        </div>
      </section>

      {/* TIENDITA */}
      <section id="tiendita" data-testid="tiendita-section" className="py-24 sm:py-32 bg-muted/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-muted-foreground uppercase tracking-[0.3em] text-xs mb-4">— Tiendita</p>
              <h2 className="font-serif-display text-5xl sm:text-6xl">Para llevar a casa</h2>
              <p className="text-muted-foreground mt-4 max-w-lg">Disponibles en nuestra tienda física. Pasa a saludarnos y llévate un pedacito de MARILÓ.</p>
            </div>
            {settings?.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm uppercase tracking-wide text-secondary hover:text-primary transition border-b border-secondary pb-1 self-start">
                Pregunta por WhatsApp <MessageCircle className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((p, idx) => (
              <motion.div key={p.id} data-testid={`tiendita-item-${idx + 1}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }} className="group">
                <div className="aspect-square rounded-2xl overflow-hidden bg-accent/30 mb-4">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Coffee className="w-10 h-10" /></div>
                  )}
                </div>
                <h3 className="font-serif-display text-2xl mb-1">{p.name}</h3>
                {p.description && <p className="text-sm text-muted-foreground mb-2">{p.description}</p>}
                <div className="flex items-center justify-between">
                  {p.price && <span className="text-primary font-medium">{p.price}</span>}
                  {!p.available && <span className="text-xs text-muted-foreground uppercase tracking-wider">Agotado</span>}
                </div>
              </motion.div>
            ))}
            {products.length === 0 && <p className="text-muted-foreground italic col-span-full">Pronto, productos hechos con amor.</p>}
          </div>
        </div>
      </section>

      {/* RECETAS */}
      <section id="recetas" data-testid="recipe-shelf-section" className="py-24 sm:py-32 max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden min-h-[420px]">
            <img src={RECIPE_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/30 to-foreground/70" />
            <div className="relative z-10 p-10 lg:p-12 h-full flex flex-col justify-end text-background">
              <p className="uppercase tracking-[0.3em] text-xs mb-4 opacity-80">— Estantería</p>
              <h2 className="font-serif-display text-5xl sm:text-6xl leading-[0.95] mb-4">Recetas <em>de la casa</em></h2>
              <p className="opacity-85 max-w-sm">Descarga nuestras recetas favoritas e instructivos para preparar la magia de MARILÓ en tu cocina.</p>
            </div>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
            {recipes.map((r, idx) => (
              <div key={r.id} className="bg-card rounded-2xl p-6 flex flex-col justify-between border border-border hover:border-primary/50 transition-all hover:-translate-y-1 duration-300">
                {r.cover_image && (
                  <div className="aspect-[3/2] rounded-xl overflow-hidden mb-4">
                    <img src={r.cover_image} alt={r.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <h3 className="font-serif-display text-2xl mb-2">{r.title}</h3>
                  {r.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{r.description}</p>}
                </div>
                <a href={`${API}/recipes/${r.id}`} target="_blank" rel="noreferrer" onClick={async (e) => {
                  e.preventDefault();
                  const res = await api.get(`/recipes/${r.id}`);
                  const a = document.createElement("a");
                  a.href = res.data.pdf_data;
                  a.download = `${r.title}.pdf`;
                  a.click();
                }} data-testid={`recipe-download-btn-${idx + 1}`} className="inline-flex items-center gap-2 text-primary text-sm uppercase tracking-wider hover:gap-3 transition-all">
                  Descargar PDF <Download className="w-4 h-4" />
                </a>
              </div>
            ))}
            {recipes.length === 0 && (
              <div className="sm:col-span-2 p-10 border border-dashed border-border rounded-2xl text-center text-muted-foreground italic">
                Recetas próximamente…
              </div>
            )}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" data-testid="gallery-section" className="py-24 sm:py-32 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="text-center mb-14">
            <p className="text-muted-foreground uppercase tracking-[0.3em] text-xs mb-4">— Galería</p>
            <h2 className="font-serif-display text-5xl sm:text-6xl">Momentos en MARILÓ</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            {gallery.map((g, idx) => (
              <motion.div key={g.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.06 }} className={`overflow-hidden rounded-2xl ${idx % 5 === 0 ? "row-span-2 aspect-[3/4] md:aspect-[3/5]" : "aspect-square"}`}>
                <img src={g.image_url} alt={g.caption} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-14">
            <a
              href={settings?.instagram_url || "#"}
              target="_blank"
              rel="noreferrer"
              data-testid="instagram-follow-btn"
              className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-full text-sm tracking-wider uppercase hover:bg-primary transition-all duration-300"
            >
              <Instagram className="w-5 h-5" />
              Síguenos {settings?.instagram_handle || "@marilocafeteria"}
            </a>
          </div>
        </div>
      </section>

      {/* LOCATION + FOOTER */}
      <section id="location" className="bg-foreground text-background">
        <div className="grid lg:grid-cols-2">
          <div className="aspect-square lg:aspect-auto min-h-[400px] relative" data-testid="location-map">
            <iframe
              title="MARILÓ map"
              src={settings?.map_embed_url || "https://www.google.com/maps?q=mexico+city&output=embed"}
              className="absolute inset-0 w-full h-full grayscale-[30%] sepia-[20%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="p-10 sm:p-16 lg:p-24 flex flex-col justify-center" data-testid="footer-contact">
            <p className="uppercase tracking-[0.3em] text-xs mb-4 opacity-70">— Visítanos</p>
            <h2 className="font-serif-display text-5xl sm:text-6xl mb-10">Ven a tomar un café</h2>
            <div className="space-y-6 text-background/90">
              {settings?.address && (
                <div className="flex gap-4">
                  <MapPin className="w-5 h-5 mt-1 text-accent flex-shrink-0" />
                  <p className="leading-relaxed">{settings.address}</p>
                </div>
              )}
              {settings?.hours && (
                <div className="flex gap-4">
                  <Clock className="w-5 h-5 mt-1 text-accent flex-shrink-0" />
                  <p className="whitespace-pre-line leading-relaxed">{settings.hours}</p>
                </div>
              )}
              {settings?.phone && (
                <div className="flex gap-4">
                  <Phone className="w-5 h-5 mt-1 text-accent flex-shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-accent transition">{settings.phone}</a>
                </div>
              )}
              {settings?.email && (
                <div className="flex gap-4">
                  <Mail className="w-5 h-5 mt-1 text-accent flex-shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-accent transition">{settings.email}</a>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 mt-10 pt-10 border-t border-background/20">
              {settings?.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="w-11 h-11 rounded-full border border-background/30 flex items-center justify-center hover:bg-accent hover:text-foreground hover:border-accent transition">
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-11 h-11 rounded-full border border-background/30 flex items-center justify-center hover:bg-accent hover:text-foreground hover:border-accent transition">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noreferrer" aria-label="Facebook" className="w-11 h-11 rounded-full border border-background/30 flex items-center justify-center hover:bg-accent hover:text-foreground hover:border-accent transition">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-background/20">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="font-serif-display text-3xl">MARILÓ</p>
            <p className="text-xs text-background/60 tracking-wider uppercase">© {new Date().getFullYear()} — Hecho con cariño</p>
          </div>
        </div>
      </section>
    </div>
  );
}
