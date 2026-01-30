import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Petshop Kat - Asistente Inteligente",
  description: "Asistente de IA para gestión de ventas e inventario de petshop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <div className="flex h-screen flex-col">{children}</div>
        </QueryProvider>
      </body>
    </html>
  );
}
