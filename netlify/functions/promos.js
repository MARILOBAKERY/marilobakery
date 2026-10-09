import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("marilo-promos");

  try {
    // GET - listar códigos
    if (req.method === "GET") {
      const data = await store.get("codigos", { type: "json" });
      return Response.json(data || []);
    }

    // POST - guardar lista completa o enviar
    if (req.method === "POST") {
      const body = await req.json();

      // Si mandan { action: "send", codigo: "...", clientes: [...] } podrías conectar con tu servicio de WhatsApp/Email aquí
      if (body.action === "send") {
        // Aquí puedes integrar tu lógica de envío
        // Por ahora solo lo guarda como enviado
        let codigos = await store.get("codigos", { type: "json" }) || [];
        // log de envío
        await store.setJSON("last_send", { fecha: new Date().toISOString(), ...body });
        return Response.json({ ok: true, message: "Código marcado como enviado", codigo: body.codigo });
      }

      // Guardado normal de códigos
      await store.setJSON("codigos", body);
      return Response.json({ ok: true, count: body.length });
    }

    // PUT - agregar/actualizar un código
    if (req.method === "PUT") {
      const nuevo = await req.json();
      let codigos = await store.get("codigos", { type: "json" }) || [];
      const idx = codigos.findIndex(c => c.id === nuevo.id || c.codigo === nuevo.codigo);
      if (idx >= 0) codigos[idx] = nuevo;
      else codigos.push(nuevo);
      await store.setJSON("codigos", codigos);
      return Response.json({ ok: true, codigos });
    }

    // DELETE
    if (req.method === "DELETE") {
      const { id, codigo } = await req.json();
      let codigos = await store.get("codigos", { type: "json" }) || [];
      codigos = codigos.filter(c => c.id !== id && c.codigo !== codigo);
      await store.setJSON("codigos", codigos);
      return Response.json({ ok: true, codigos });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
};
