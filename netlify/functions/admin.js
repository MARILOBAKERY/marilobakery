import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  try {
    const { password } = await req.json();

    // Lee la contraseña desde Netlify Environment Variables
    // Si no existe, usa admin123 solo para la migración
    const REAL_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

    if (!password) {
      return Response.json({ ok: false, error: "Falta contraseña" }, { status: 400 });
    }

    if (password === REAL_PASSWORD) {
      return Response.json({ 
        ok: true, 
        token: "marilo-admin-ok",
        message: "Acceso concedido" 
      });
    } else {
      return Response.json({ ok: false, error: "Contraseña incorrecta" }, { status: 401 });
    }
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
};
