import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("marilo-menu");

  try {
    // GET - listar productos
    if (req.method === "GET") {
      const data = await store.get("productos", { type: "json" });
      return Response.json(data || []);
    }

    // POST - guardar todos los productos (sobre-escribe)
    if (req.method === "POST") {
      const productos = await req.json();
      await store.setJSON("productos", productos);
      return Response.json({ ok: true, count: productos.length });
    }

    // PUT - agregar o actualizar un producto
    if (req.method === "PUT") {
      const nuevo = await req.json();
      let productos = await store.get("productos", { type: "json" }) || [];
      const idx = productos.findIndex(p => p.id === nuevo.id);
      if (idx >= 0) productos[idx] = nuevo;
      else productos.push(nuevo);
      await store.setJSON("productos", productos);
      return Response.json({ ok: true, productos });
    }

    // DELETE
    if (req.method === "DELETE") {
      const { id } = await req.json();
      let productos = await store.get("productos", { type: "json" }) || [];
      productos = productos.filter(p => p.id !== id);
      await store.setJSON("productos", productos);
      return Response.json({ ok: true, productos });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
};
