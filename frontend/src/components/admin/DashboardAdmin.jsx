import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Coffee, ShoppingBag, FileText, Users, Eye, Download as DownloadIcon, CheckCircle2, ImageIcon } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className={`rounded-2xl border border-border p-5 ${accent || "bg-card"}`}>
    <div className="flex items-center justify-between mb-3">
      <Icon className="w-5 h-5 opacity-70" />
      <p className="text-[10px] uppercase tracking-[0.2em] opacity-70">{label}</p>
    </div>
    <p className="font-serif-display text-4xl leading-none">{value}</p>
  </div>
);

export default function DashboardAdmin() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/analytics/overview").then((r) => setData(r.data)).catch(() => {});
  }, []);

  if (!data) return <p className="text-muted-foreground">Cargando dashboard…</p>;

  const t = data.totals;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif-display text-4xl">Dashboard</h2>
        <p className="text-muted-foreground text-sm">Vista general de MARILÓ</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Users} label="Suscriptores" value={t.subscribers} accent="bg-primary text-primary-foreground" />
        <StatCard icon={CheckCircle2} label="Cupones canjeados" value={t.redeemed} accent="bg-secondary text-secondary-foreground" />
        <StatCard icon={Eye} label="Vistas tiendita" value={t.product_views} />
        <StatCard icon={DownloadIcon} label="Descargas recetas" value={t.recipe_downloads} />
        <StatCard icon={Coffee} label="Carta" value={t.menu_items} />
        <StatCard icon={ShoppingBag} label="Productos" value={t.products} />
        <StatCard icon={FileText} label="Recetas" value={t.recipes} />
        <StatCard icon={ImageIcon} label="% Conversión" value={`${t.subscribers ? Math.round((t.redeemed / t.subscribers) * 100) : 0}%`} />
      </div>

      {/* Subs per week */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
        <h3 className="font-serif-display text-2xl mb-1">Suscripciones · últimas 8 semanas</h3>
        <p className="text-xs text-muted-foreground mb-5">Crecimiento de tu comunidad</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.subs_per_week} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B06D53" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#B06D53" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6DFD4" vertical={false} />
              <XAxis dataKey="label" stroke="#6B5C53" tick={{ fontSize: 11 }} />
              <YAxis stroke="#6B5C53" tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#EFE9DF", border: "1px solid #D1C7BB", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="subs" stroke="#B06D53" strokeWidth={2} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <h3 className="font-serif-display text-2xl mb-1">Top productos · Tiendita</h3>
          <p className="text-xs text-muted-foreground mb-5">Más vistos por tus clientes</p>
          {data.top_products.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Aún sin datos. Comparte tu web para empezar.</p>
          ) : (
            <div className="space-y-3">
              {data.top_products.map((p, i) => (
                <div key={p.id} className="flex items-center gap-4">
                  <span className="font-serif-display text-2xl text-primary w-8">{i + 1}</span>
                  {p.image_url ? <img src={p.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" /> : <div className="w-12 h-12 rounded-lg bg-muted" />}
                  <p className="flex-1 truncate text-sm font-medium">{p.name}</p>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{p.count} {p.count === 1 ? "vista" : "vistas"}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top recipes */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <h3 className="font-serif-display text-2xl mb-1">Top recetas descargadas</h3>
          <p className="text-xs text-muted-foreground mb-5">Lo que más interesa de tu estantería</p>
          {data.top_recipes.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Aún sin descargas. Sube tu primer PDF y compártelo.</p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.top_recipes} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6DFD4" horizontal={false} />
                  <XAxis type="number" stroke="#6B5C53" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="title" stroke="#6B5C53" tick={{ fontSize: 11 }} width={110} />
                  <Tooltip contentStyle={{ background: "#EFE9DF", border: "1px solid #D1C7BB", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" fill="#7A8974" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
