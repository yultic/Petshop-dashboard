"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  BarChart3,
  Database,
  Settings,
  FileUp,
  X, // Importar el ícono X
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Predicciones", href: "/predictions", icon: TrendingUp },
  { name: "Productos", href: "/products", icon: Package },
  { name: "Stock", href: "/stock", icon: BarChart3 },
  { name: "Datos", href: "/data", icon: Database },
  { name: "Upload", href: "/upload", icon: FileUp },
  { name: "Configuración", href: "/settings", icon: Settings },
];

// Definir las props del componente
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 flex-col border-r bg-card transition-transform duration-300 ease-in-out",
        "sm:relative sm:translate-x-0", // Estilos para escritorio
        isOpen ? "translate-x-0" : "-translate-x-full" // Estilos para móvil
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo y botón de cierre */}
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 flex-grow">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Petshop AI</h1>
              <p className="text-xs text-muted-foreground">
                Predictor de Ventas
              </p>
            </div>
          </Link>
          {/* Botón de cierre para móvil */}
          <button
            onClick={onClose}
            className="sm:hidden rounded-md p-2 text-muted-foreground hover:bg-muted"
            aria-label="Cerrar menú"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose} // Cierra el menú al hacer clic en un enlace en móvil
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs font-medium">Sistema de Predicciones</p>
            <p className="text-xs text-muted-foreground mt-1">
              Modelos ML entrenados con XGBoost
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
