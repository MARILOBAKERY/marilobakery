import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const empty = { name: "", description: "", price: "", category: "Cafés", order: 0, available: true };

export default function MenuAdmin() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const r = await api.get("/menu");
    setItems(r.data);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (it) => { setEditing(it); setForm({ name: it.name, description: it.description || "", price: it.price, category: it.category, order: it.order || 0, available: it.available }); setOpen(true); };

  const save = async () => {
    try {
      if (editing) await api.put(`/menu/${editing.id}`, form);
      else await api.post("/menu", form);
      toast.success("Guardado");
      setOpen(false);
      load();
    } catch (e) {
      toast.error("Error al guardar");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar?")) return;
    await api.delete(`/menu/${id}`);
    toast.success("Eliminado");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif-display text-4xl">Carta</h2>
          <p className="text-muted-foreground text-sm">Gestiona los productos de tu carta</p>
        </div>
        <Button onClick={openNew} data-testid="admin-add-item-btn"><Plus className="w-4 h-4 mr-2" /> Nuevo</Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Disp.</TableHead>
              <TableHead className="w-32 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((it) => (
              <TableRow key={it.id} data-testid="admin-table-row">
                <TableCell>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs text-muted-foreground">{it.description}</div>
                </TableCell>
                <TableCell>{it.category}</TableCell>
                <TableCell>{it.price}</TableCell>
                <TableCell>{it.available ? "Sí" : "No"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(it)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(it.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Editar producto" : "Nuevo producto"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Nombre</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Descripción</Label><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Categoría</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Cafés, Tés…" /></div>
              <div><Label>Precio</Label><Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="$55" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4 items-end">
              <div><Label>Orden</Label><Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} /></div>
              <div className="flex items-center gap-3 pb-2"><Switch checked={form.available} onCheckedChange={(v) => setForm({ ...form, available: v })} /><Label>Disponible</Label></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save} data-testid="admin-edit-submit">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
