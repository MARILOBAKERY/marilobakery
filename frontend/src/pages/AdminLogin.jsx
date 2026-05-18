import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@marilo.cafe");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const formatErr = (d) => {
    if (!d) return "Algo salió mal";
    if (typeof d === "string") return d;
    if (Array.isArray(d)) return d.map((e) => e.msg || JSON.stringify(e)).join(" ");
    return String(d.msg || d);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Bienvenida de vuelta");
      navigate("/admin");
    } catch (err) {
      toast.error(formatErr(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8" data-testid="back-to-home">
          <ArrowLeft className="w-4 h-4" /> Volver a la web
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="font-serif-display text-4xl">MARILÓ</CardTitle>
            <CardDescription>Panel de administración</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required data-testid="admin-login-email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required data-testid="admin-login-password" />
              </div>
              <Button type="submit" disabled={loading} className="w-full" data-testid="admin-login-submit">
                {loading ? "Entrando…" : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
