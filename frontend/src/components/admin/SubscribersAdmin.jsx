import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Mail, Download } from "lucide-react";
import { toast } from "sonner";

export default function SubscribersAdmin() {
  const [items, setItems] = useState([]);

  const load = async () => {
    try { setItems((await api.get("/subscribers")).data); } catch { toast.error("Error cargando suscriptores"); }
  };
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar?")) return;
    await api.delete(`/subscribers/${id}`);
    toast.success("Eliminado");
    load();
  };

  const exportCsv = () => {
    const rows = [["email", "nombre", "cupón", "email_enviado", "fecha"]];
    items.forEach((s) => rows.push([s.email, s.name || "", s.coupon || "", s.email_sent ? "sí" : "no", s.created_at || ""]));
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `suscriptores-marilo-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h2 className="font-serif-display text-4xl">Suscriptores</h2>
          <p className="text-muted-foreground text-sm">{items.length} {items.length === 1 ? "persona" : "personas"} en tu comunidad</p>
        </div>
        <Button onClick={exportCsv} variant="outline"><Download className="w-4 h-4 mr-2" /> Exportar CSV</Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Cupón</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.email}</TableCell>
                <TableCell>{s.name || "—"}</TableCell>
                <TableCell><span className="font-mono text-xs bg-muted px-2 py-1 rounded">{s.coupon}</span></TableCell>
                <TableCell>{s.email_sent ? <Mail className="w-4 h-4 text-secondary" /> : <span className="text-xs text-muted-foreground">no enviado</span>}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{s.created_at ? new Date(s.created_at).toLocaleDateString("es") : ""}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => remove(s.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-10 italic">Aún no hay suscriptores. ¡Pronto llegarán!</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
