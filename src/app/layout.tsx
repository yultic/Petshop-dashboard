"use client"; // Convertir a Client Component

import { useState } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

// La metadata no puede exportarse desde un Client Component.
// Se debe mover a un Layout de nivel superior si es necesario o manejarla de otra forma.
// Por ahora, la comentamos para que el build no falle.
// export const metadata: Metadata = {
//   title: "Petshop AI - Dashboard de Predicciones",
//   description: "Sistema de predicción de ventas con Machine Learning",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn(inter.className, "overflow-hidden")}>
        <QueryProvider>
          <div className="flex h-screen">
            {/* Overlay para cerrar el menú en móvil */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-30 bg-black/50 sm:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            <Sidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />

            <div className="flex flex-1 flex-col overflow-hidden">
              <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
              <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-6">
                {children}
              </main>
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
