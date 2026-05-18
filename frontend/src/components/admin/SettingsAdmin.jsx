import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function SettingsAdmin() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/settings").then((r) => setForm(r.data));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/settings", form);
      toast.success("Ajustes guardados");
    } catch { toast.error("Error al guardar"); }
    finally { setSaving(false); }
  };

  if (!form) return <p className="text-muted-foreground">Cargando…</p>;

  const fld = (k) => ({ value: form[k] || "", onChange: (e) => setForm({ ...form, [k]: e.target.value }) });

  return (
    <div className="max-w-2xl">
      <h2 className="font-serif-display text-4xl mb-2">Ajustes</h2>
      <p className="text-muted-foreground text-sm mb-8">Información que aparece en tu web</p>

      <div className="space-y-5 bg-card border border-border rounded-xl p-6">
        <div><Label>Tagline (eslogan)</Label><Input {...fld("tagline")} /></div>
        <div><Label>Dirección</Label><Textarea rows={2} {...fld("address")} /></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Teléfono</Label><Input {...fld("phone")} /></div>
          <div><Label>WhatsApp</Label><Input {...fld("whatsapp")} placeholder="+52 55 1234 5678" /></div>
        </div>
        <div><Label>Email</Label><Input type="email" {...fld("email")} /></div>
        <div><Label>Horarios (varias líneas)</Label><Textarea rows={3} {...fld("hours")} /></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Instagram URL</Label><Input {...fld("instagram_url")} /></div>
          <div><Label>Instagram handle</Label><Input {...fld("instagram_handle")} placeholder="@marilocafeteria" /></div>
        </div>
        <div><Label>Facebook URL</Label><Input {...fld("facebook_url")} /></div>
        <div>
          <Label>Google Maps embed URL</Label>
          <Textarea rows={3} {...fld("map_embed_url")} />
          <p className="text-xs text-muted-foreground mt-1">En Google Maps → Compartir → Insertar mapa → copia el src del iframe.</p>
        </div>

        <Button onClick={save} disabled={saving} className="w-full">{saving ? "Guardando…" : "Guardar cambios"}</Button>
      </div>
    </div>
  );
}
