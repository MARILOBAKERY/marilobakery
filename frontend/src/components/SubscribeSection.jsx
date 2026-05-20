import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, CheckCircle2, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function SubscribeSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);
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
    <section id="suscribete" data-testid="subscribe-section" className="bg-[#fdda25] py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p className="tracking-[0.4em] text-xs text-black/70 font-semibold uppercase">— Comunidad MARILÓ —</p>
          <h2 className="font-display text-5xl sm:text-7xl text-[var(--marilo-coral)] mt-3 tracking-wide">
            TE INVITAMOS UN CAFÉ
          </h2>
          <p className="font-script text-xl sm:text-2xl text-black/85 max-w-lg mx-auto mt-6 mb-8 sm:mb-10">
            Suscríbete y recibe un cupón único para tu próxima visita, novedades de la carta y recetas exclusivas. Sin spam, lo prometemos.
          </p>

          {done ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 sm:p-10" data-testid="subscribe-success">
              <CheckCircle2 className="w-10 h-10 text-[var(--marilo-coral)] mx-auto mb-3" />
              <h3 className="font-display text-3xl tracking-wide mb-2">{done.already_subscribed ? "¡YA ERAS PARTE!" : "¡BIENVENIDA A MARILÓ!"}</h3>
              <p className="text-black/70 text-sm mb-5">{done.email_sent ? "Te enviamos un correo con tu cupón. Si no lo ves, revisa tu carpeta de spam." : "Muestra este código en tu próxima visita:"}</p>
              <div className="inline-block bg-[var(--marilo-coral)] text-white px-6 py-3 font-mono tracking-[0.2em] font-semibold" data-testid="subscribe-coupon">{done.coupon}</div>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3 max-w-md mx-auto">
              <input type="text" placeholder="Tu nombre (opcional)" value={name} onChange={(e) => setName(e.target.value)} data-testid="subscribe-name" className="w-full px-5 py-3.5 bg-white text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[var(--marilo-coral)]" />
              <input type="email" required placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="subscribe-email" className="w-full px-5 py-3.5 bg-white text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[var(--marilo-coral)]" />
              <button type="submit" disabled={loading} data-testid="subscribe-submit" className="btn-pill bg-[var(--marilo-coral)] text-white inline-flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Enviando…</>) : (<><Gift className="w-4 h-4" /> Quiero mi café gratis</>)}
              </button>
              {error && <p className="text-red-700 text-xs mt-1">{error}</p>}
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
