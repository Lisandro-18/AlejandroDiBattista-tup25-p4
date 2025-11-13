import React from "react";
import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

export const metadata = {
  title: "Panel de control",
  description: "Gestión del sistema",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar a la izquierda */}
      <Sidebar />

      {/* Contenedor principal */}
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-6 bg-background text-foreground">{children}</main>
      </div>
    </div>
  );
}
