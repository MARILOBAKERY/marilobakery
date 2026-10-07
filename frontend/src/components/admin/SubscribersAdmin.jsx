import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Mail, Download, Ticket, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function SubscribersAdmin() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, redeemed: 0, pending: 0, conversion_rate: 0 });
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [lastRedeem, setLastRedeem] = useState(null);

  const loadAll = async () => {
    try {
      const [s, st] = await Promise.all([api.get("/subscribers"), api.get("/coupons/stats")]);
      setItems(s.data); setStats(st.data);
    } catch { toast.error("Error cargando datos"); }
  };
  useEffect(() => { loadAll(); }, []);

  const redeem = async (e) => {
    e?.preventDefault();
    if (!code.trim()) return;
    setBusy(true); setLastRedeem(null);
    try {
      const { data } = await api.post("/coupons/redeem", { code });
      setLastRedeem(data);
      if (data.ok) toast.success("¡Cupón canjeado!");
      else toast.warning(data.message);
      setCode("");
      loadAll();
    } catch (err) {
      const d = err.response?.data?.detail;
      setLastRedeem({ ok: false, message: typeof d === "string" ? d : "Error" });
      toast.error(typeof d === "string" ? d : "Error");
    } finally { setBusy(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar?")) return;
    await api.delete(`/subscribers/${id}`);
    loadAll();
  };

  const exportCsv = () => {
    const rows = [["email", "nombre", "teléfono", "cupón", "email_enviado", "canjeado", "fecha_canje", "fecha_alta"]];
    items.forEach((s) => rows.push([s.email, s.name || "", s.phone || "", s.coupon || "", s.email_sent ? "sí" : "no", s.redeemed ? "sí" : "no", s.redeemed_at || "", s.created_at || ""]));
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `suscriptores-marilo-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-serif-display text-4xl">Suscriptores y Cupones</h2>
          <p className="text-muted-foreground text-sm">Gestiona tu comunidad y canjea cupones al vuelo</p>
        </div>
        <Button onClick={exportCsv} variant="outline"><Download className="w-4 h-4 mr-2" /> Exportar CSV</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {[
          { l: "Total", v: stats.total, c: "bg-card" },
          { l: "Canjeados", v: stats.redeemed, c: "bg-secondary text-secondary-foreground" },
          { l: "Pendientes", v: stats.pending, c: "bg-card" },
          { l: "Conversión", v: `${stats.conversion_rate}%`, c: "bg-primary text-primary-foreground" },
        ].map((s) => (
          <div key={s.l} className={`${s.c} border border-border rounded-xl p-4`}>
            <p className="text-xs uppercase tracking-wider opacity-80">{s.l}</p>
            <p className="font-serif-display text-3xl mt-1">{s.v}</p>
          </div>
        ))}
      </div>

      {/* Redeem */}
      <div className="bg-card border border-border rounded-xl p-5 sm:p-6 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Ticket className="w-5 h-5 text-primary" />
          <h3 className="font-serif-display text-2xl">Canjear cupón</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Pídele el código al cliente (ej: <span className="font-mono">MARILO-AB12CD</span>) y márcalo como canjeado.</p>
        <form onSubmit={redeem} className="flex flex-col sm:flex-row gap-3">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="MARILO-XXXXXX"
            className="font-mono tracking-wider uppercase"
            data-testid="redeem-code-input"
          />
          <Button type="submit" disabled={busy} data-testid="redeem-submit">{busy ? "Validando…" : "Canjear"}</Button>
        </form>
        {lastRedeem && (
          <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${lastRedeem.ok ? "bg-secondary/10 border border-secondary/30" : "bg-destructive/10 border border-destructive/30"}`} data-testid="redeem-result">
            {lastRedeem.ok ? <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />}
            <div className="text-sm">
              <p className="font-medium">{lastRedeem.message}</p>
              {lastRedeem.subscriber && (
                <p className="text-muted-foreground mt-1">
                  {lastRedeem.subscriber.name || "Sin nombre"} · {lastRedeem.subscriber.email}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Cupón</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.email}</TableCell>
                <TableCell>{s.name || "—"}</TableCell>
                <TableCell>{s.phone || "—"}</TableCell>
                <TableCell><span className="font-mono text-xs bg-muted px-2 py-1 rounded">{s.coupon}</span></TableCell>
                <TableCell>{s.email_sent ? <Mail className="w-4 h-4 text-secondary" /> : <span className="text-xs text-muted-foreground">no enviado</span>}</TableCell>
                <TableCell>
                  {s.redeemed
                    ? <span className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" /> Canjeado</span>
                    : <span className="text-xs text-muted-foreground">Pendiente</span>}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{s.created_at ? new Date(s.created_at).toLocaleDateString("es") : ""}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => remove(s.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-10 italic">Aún no hay suscriptores. ¡Pronto llegarán!</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
