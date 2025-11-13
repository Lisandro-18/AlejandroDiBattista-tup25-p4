"use client";

import React from "react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-800 text-white h-screen p-6">
      <h2 className="text-lg font-semibold mb-4">Menú</h2>
      <ul className="space-y-2">
        <li>
          <Link href="/dashboard" className="hover:text-zinc-300">
            Inicio
          </Link>
        </li>
        <li>
          <Link href="/dashboard/productos" className="hover:text-zinc-300">
            Productos
          </Link>
        </li>
        <li>
          <Link href="/dashboard/clientes" className="hover:text-zinc-300">
            Clientes
          </Link>
        </li>
        <li>
          <Link href="/dashboard/ventas" className="hover:text-zinc-300">
            Ventas
          </Link>
        </li>
      </ul>
    </aside>
  );
}
