// frontend/src/components/Header.tsx
"use client";

import Link from "next/link";
import { useCarritoStore } from "../store/useCarritoStore";

export default function Header() {
  const { carrito } = useCarritoStore();
  const totalProductos = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-800">
          🛍️ Mi Tienda TP6
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/dashboard/productos"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Dashboard
          </Link>

          <Link
            href="/carrito"
            className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2"
          >
            🛒 Carrito
            <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm">
              {totalProductos}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
