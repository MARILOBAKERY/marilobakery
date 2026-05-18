import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const fileToDataUrl = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

const empty = { title: "", description: "", pdf_data: "", cover_image: "" };

export default function RecipesAdmin() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);

  const load = async () => setItems((await api.get("/recipes")).data);
  useEffect(() => { load(); }, []);

  const handlePdf = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== "application/pdf") return toast.error("Sube un PDF");
    if (f.size > 8_000_000) return toast.error("PDF muy grande (máx 8MB)");
    setBusy(true);
    const data = await fileToDataUrl(f);
    setForm((p) => ({ ...p, pdf_data: data }));
    setBusy(false);
  };

  const handleCover = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 2_500_000) return toast.error("Portada muy grande (máx 2.5MB)");
    const data = await fileToDataUrl(f);
    setForm((p) => ({ ...p, cover_image: data }));
  };

  const save = async () => {
    if (!form.title || !form.pdf_data) return toast.error("Falta título o PDF");
    setBusy(true);
    try {
      await api.post("/recipes", form);
      toast.success("Receta añadida");
      setOpen(false);
      setForm(empty);
      load();
    } catch {
      toast.error("Error al guardar");
    } finally { setBusy(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar?")) return;
    await api.delete(`/recipes/${id}`);
    toast.success("Eliminada");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif-display text-4xl">Recetas e instructivos</h2>
          <p className="text-muted-foreground text-sm">Sube PDFs descargables para tus clientes</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-2" /> Nueva receta</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((r) => (
          <div key={r.id} className="bg-card border border-border rounded-xl overflow-hidden group">
            {r.cover_image ? (
              <img src={r.cover_image} alt={r.title} className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-40 bg-muted flex items-center justify-center"><FileText className="w-10 h-10 text-muted-foreground" /></div>
            )}
            <div className="p-5">
              <h3 className="font-serif-display text-2xl mb-1">{r.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{r.description}</p>
              <Button variant="destructive" size="sm" onClick={() => remove(r.id)}><Trash2 className="w-4 h-4 mr-2" /> Eliminar</Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nueva receta</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Título</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Descripción</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>PDF</Label><Input type="file" accept="application/pdf" onChange={handlePdf} />{form.pdf_data && <p className="text-xs text-muted-foreground mt-1">PDF cargado ✓</p>}</div>
            <div><Label>Portada (opcional)</Label><Input type="file" accept="image/*" onChange={handleCover} />{form.cover_image && <img src={form.cover_image} alt="" className="mt-2 rounded max-h-32" />}</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save} disabled={busy}>{busy ? "Guardando…" : "Guardar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
