import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // AHORA USA NETLIFY FUNCTION, NO EMERGENT
      const res = await fetch("/.netlify/functions/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.ok) {
        localStorage.setItem("marilo-admin-token", data.token);
        localStorage.setItem("marilo-is-admin", "true");
        navigate("/admin/dashboard");
      } else {
        setError("Contraseña incorrecta. Usa la nueva que pusiste en Netlify.");
      }
    } catch (err) {
      setError("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fdf6f0" }}>
      <form onSubmit={handleLogin} style={{ background: "white", padding: 40, borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", width: 400 }}>
        <h1 style={{ textAlign: "center", marginBottom: 20 }}>Mariló Admin</h1>
        <input
          type="password"
          placeholder="Tu nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", marginBottom: 16 }}
        />
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 12, borderRadius: 8, background: "#d94f70", color: "white", border: "none", cursor: "pointer" }}>
          {loading ? "Verificando..." : "Entrar"}
        </button>
        <p style={{ fontSize: 11, color: "#999", marginTop: 12, textAlign: "center" }}>
          Conectado a Netlify. Ya no usa admin123 ni Emergent.
        </p>
      </form>
    </div>
  );
}
