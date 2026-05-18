import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const fileToDataUrl = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

export default function GalleryAdmin() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ image_url: "", caption: "", order: 0 });
  const [uploading, setUploading] = useState(false);

  const load = async () => setItems((await api.get("/gallery")).data);
  useEffect(() => { load(); }, []);

  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 3_500_000) return toast.error("Imagen muy grande (máx 3.5MB)");
    setUploading(true);
    const data = await fileToDataUrl(f);
    setForm((p) => ({ ...p, image_url: data }));
    setUploading(false);
  };

  const save = async () => {
    if (!form.image_url) return toast.error("Sube o pega una imagen");
    await api.post("/gallery", form);
    toast.success("Imagen añadida");
    setOpen(false);
    setForm({ image_url: "", caption: "", order: 0 });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar?")) return;
    await api.delete(`/gallery/${id}`);
    toast.success("Eliminada");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif-display text-4xl">Galería</h2>
          <p className="text-muted-foreground text-sm">Sube fotos para mostrar en la web</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-2" /> Añadir foto</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((g) => (
          <div key={g.id} className="relative group rounded-xl overflow-hidden bg-card border border-border">
            <img src={g.image_url} alt={g.caption} className="w-full h-48 object-cover" />
            <button onClick={() => remove(g.id)} className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
              <Trash2 className="w-4 h-4" />
            </button>
            {g.caption && <p className="p-3 text-xs">{g.caption}</p>}
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Añadir foto</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Imagen (sube archivo o pega URL)</Label>
              <Input type="file" accept="image/*" onChange={handleFile} />
              {uploading && <p className="text-xs text-muted-foreground mt-1">Procesando…</p>}
              <Input className="mt-2" placeholder="O pega URL https://…" value={form.image_url?.startsWith("data:") ? "" : form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              {form.image_url && <img src={form.image_url} alt="" className="mt-3 rounded-lg max-h-40 object-cover w-full" />}
            </div>
            <div><Label>Descripción</Label><Input value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} /></div>
            <div><Label>Orden</Label><Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save}>Añadir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
