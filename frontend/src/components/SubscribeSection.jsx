import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, CheckCircle2, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function SubscribeSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null); // {coupon, already_subscribed, email_sent}
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/subscribe", { email, name });
      setDone(data);
    } catch (err) {
      const d = err.response?.data?.detail;
      setError(typeof d === "string" ? d : "No pudimos registrar tu email. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="suscribete" data-testid="subscribe-section" className="py-16 sm:py-24 lg:py-32 bg-foreground text-background">
      <div className="max-w-3xl mx-auto px-5 sm:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-foreground mb-6">
            <Gift className="w-7 h-7" />
          </div>
          <p className="uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-3 opacity-70">— Comunidad MARILÓ</p>
          <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl mb-5 leading-tight">
            Suscríbete y <em className="text-accent">te invitamos un café</em>
          </h2>
          <p className="text-background/80 max-w-lg mx-auto text-sm sm:text-base mb-8 sm:mb-10 leading-relaxed">
            Recibe un cupón único para tu próxima visita, novedades de la carta y recetas exclusivas. Sin spam, lo prometemos.
          </p>

          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-background/10 border border-background/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm"
              data-testid="subscribe-success"
            >
              <CheckCircle2 className="w-10 h-10 text-accent mx-auto mb-3" />
              <h3 className="font-serif-display text-2xl sm:text-3xl mb-3">
                {done.already_subscribed ? "¡Ya eras parte!" : "¡Bienvenida/o a MARILÓ!"}
              </h3>
              <p className="text-background/80 text-sm mb-5">
                {done.email_sent
                  ? "Te enviamos un correo con tu cupón. Si no lo ves, revisa tu carpeta de spam."
                  : "Muestra este código en tu próxima visita:"}
              </p>
              <div className="inline-block bg-accent text-foreground px-6 py-3 rounded-full font-mono tracking-[0.2em] font-semibold" data-testid="subscribe-coupon">
                {done.coupon}
              </div>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Tu nombre (opcional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="subscribe-name"
                className="w-full px-5 py-3.5 rounded-full bg-background/10 border border-background/20 text-background placeholder:text-background/50 focus:outline-none focus:border-accent transition"
              />
              <input
                type="email"
                required
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="subscribe-email"
                className="w-full px-5 py-3.5 rounded-full bg-background/10 border border-background/20 text-background placeholder:text-background/50 focus:outline-none focus:border-accent transition"
              />
              <button
                type="submit"
                disabled={loading}
                data-testid="subscribe-submit"
                className="inline-flex items-center justify-center gap-2 bg-accent text-foreground px-6 py-3.5 rounded-full text-sm uppercase tracking-wider font-medium hover:bg-background hover:text-foreground transition disabled:opacity-60"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando…</> : "Quiero mi café gratis"}
              </button>
              {error && <p className="text-destructive text-xs mt-1">{error}</p>}
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
