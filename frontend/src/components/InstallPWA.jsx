import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Smartphone } from "lucide-react";

const DISMISS_KEY = "marilo_pwa_dismissed_at";
const DISMISS_DAYS = 7;

export default function InstallPWA() {
  const [deferred, setDeferred] = useState(null);
  const [show, setShow] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  const recentlyDismissed = () => {
    const ts = localStorage.getItem(DISMISS_KEY);
    if (!ts) return false;
    const diff = Date.now() - parseInt(ts, 10);
    return diff < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  };

  useEffect(() => {
    // Already installed?
    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) return;
    if (recentlyDismissed()) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferred(e);
      setTimeout(() => setShow(true), 4000); // wait so user can browse first
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS Safari fallback (no beforeinstallprompt)
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua) && !/crios|fxios/.test(ua);
    if (isIOS) {
      setTimeout(() => {
        setIosHint(true);
        setShow(true);
      }, 6000);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted" || choice.outcome === "dismissed") {
      setShow(false);
      setDeferred(null);
      if (choice.outcome === "dismissed") localStorage.setItem(DISMISS_KEY, String(Date.now()));
    }
  };

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-7 sm:bottom-24 sm:w-[360px] z-50"
          data-testid="pwa-install-banner"
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl shadow-black/20 p-5 flex gap-4 items-start">
            <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-serif-display text-xl mb-1">Llévate MARILÓ contigo</h4>
              {iosHint ? (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Toca el botón <span className="font-medium">Compartir</span> de Safari y elige{" "}
                  <span className="font-medium">"Añadir a pantalla de inicio"</span> para tener MARILÓ como una app.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  Instala nuestra web como una app en tu pantalla de inicio. Sin App Store, sin ocupar espacio.
                </p>
              )}
              {!iosHint && deferred && (
                <button
                  onClick={install}
                  data-testid="pwa-install-btn"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs uppercase tracking-wide hover:bg-primary/90 transition"
                >
                  <Download className="w-3.5 h-3.5" /> Instalar
                </button>
              )}
            </div>
            <button onClick={dismiss} aria-label="Cerrar" className="text-muted-foreground hover:text-foreground -mt-1 -mr-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
