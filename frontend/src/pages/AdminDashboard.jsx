import { useState } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Coffee, ImageIcon, FileText, ShoppingBag, Settings as SettingsIcon, LogOut, Home } from "lucide-react";
import MenuAdmin from "@/components/admin/MenuAdmin";
import GalleryAdmin from "@/components/admin/GalleryAdmin";
import RecipesAdmin from "@/components/admin/RecipesAdmin";
import ProductsAdmin from "@/components/admin/ProductsAdmin";
import SettingsAdmin from "@/components/admin/SettingsAdmin";

const NAV = [
  { to: "/admin/menu", label: "Carta", icon: Coffee, testid: "admin-nav-menu" },
  { to: "/admin/tiendita", label: "Tiendita", icon: ShoppingBag, testid: "admin-nav-tiendita" },
  { to: "/admin/recetas", label: "Recetas (PDFs)", icon: FileText, testid: "admin-nav-recipes" },
  { to: "/admin/galeria", label: "Galería", icon: ImageIcon, testid: "admin-nav-gallery" },
  { to: "/admin/ajustes", label: "Ajustes", icon: SettingsIcon, testid: "admin-nav-settings" },
];

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    nav("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <h1 className="font-serif-display text-3xl">MARILÓ</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              data-testid={n.testid}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                }`
              }
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border space-y-2">
          <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-muted">
            <Home className="w-4 h-4" /> Ver web
          </a>
          <button onClick={handleLogout} data-testid="admin-logout" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-destructive hover:text-destructive-foreground transition text-left">
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-card border-b border-border flex items-center justify-between p-4">
        <h1 className="font-serif-display text-xl">MARILÓ Admin</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>Menú</Button>
          <Button variant="destructive" size="sm" onClick={handleLogout}>Salir</Button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden fixed top-16 left-0 right-0 z-30 bg-card border-b border-border p-4 space-y-1">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)} className={({ isActive }) => `block px-4 py-2 rounded ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
              {n.label}
            </NavLink>
          ))}
        </div>
      )}

      {/* Main */}
      <main className="flex-1 p-6 lg:p-10 pt-24 lg:pt-10 overflow-x-hidden">
        <Routes>
          <Route index element={<MenuAdmin />} />
          <Route path="menu" element={<MenuAdmin />} />
          <Route path="tiendita" element={<ProductsAdmin />} />
          <Route path="recetas" element={<RecipesAdmin />} />
          <Route path="galeria" element={<GalleryAdmin />} />
          <Route path="ajustes" element={<SettingsAdmin />} />
        </Routes>
      </main>
    </div>
  );
}
