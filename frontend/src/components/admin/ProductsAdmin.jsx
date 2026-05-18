import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const fileToDataUrl = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

const empty = { name: "", description: "", price: "", image_url: "", available: true, order: 0 };

export default function ProductsAdmin() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = async () => setItems((await api.get("/products")).data);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (it) => { setEditing(it); setForm({ ...empty, ...it }); setOpen(true); };

  const handleImg = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 3_500_000) return toast.error("Imagen muy grande (máx 3.5MB)");
    const data = await fileToDataUrl(f);
    setForm((p) => ({ ...p, image_url: data }));
  };

  const save = async () => {
    if (!form.name) return toast.error("Nombre requerido");
    try {
      if (editing) await api.put(`/products/${editing.id}`, form);
      else await api.post("/products", form);
      toast.success("Guardado");
      setOpen(false);
      load();
    } catch { toast.error("Error"); }
  };

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar?")) return;
    await api.delete(`/products/${id}`);
    toast.success("Eliminado");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif-display text-4xl">Tiendita</h2>
          <p className="text-muted-foreground text-sm">Productos físicos disponibles en tu cafetería</p>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" /> Nuevo producto</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-xl overflow-hidden">
            {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-44 object-cover" />}
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-serif-display text-xl">{p.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                </div>
                {p.price && <span className="text-primary font-medium whitespace-nowrap">{p.price}</span>}
              </div>
              <p className="text-xs mt-2 text-muted-foreground">{p.available ? "Disponible" : "Agotado"}</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => openEdit(p)}><Pencil className="w-3 h-3 mr-1" />Editar</Button>
                <Button size="sm" variant="destructive" onClick={() => remove(p.id)}><Trash2 className="w-3 h-3" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Editar producto" : "Nuevo producto"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Nombre</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Descripción</Label><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Precio</Label><Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="$240" /></div>
              <div><Label>Orden</Label><Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} /></div>
            </div>
            <div>
              <Label>Imagen</Label>
              <Input type="file" accept="image/*" onChange={handleImg} />
              <Input className="mt-2" placeholder="O pega URL https://…" value={form.image_url?.startsWith("data:") ? "" : form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              {form.image_url && <img src={form.image_url} alt="" className="mt-2 rounded max-h-32" />}
            </div>
            <div className="flex items-center gap-3"><Switch checked={form.available} onCheckedChange={(v) => setForm({ ...form, available: v })} /><Label>Disponible</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
