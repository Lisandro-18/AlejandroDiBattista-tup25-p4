"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function HomePage() {
  const [productos, setProductos] = useState<any[]>([]);
  const { addToCart, totalItems } = useCart();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/productos")
      .then((r) => r.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("fetch productos:", err));
  }, []);

  const srcFor = (p: any) =>
    p.imagen?.startsWith("http")
      ? p.imagen
      : `http://127.0.0.1:8000/imagenes/${p.imagen}`;

  return (
    <main className="min-h-screen bg-gray-100 p-8 relative">
      {/* 🔹 Botón fijo del carrito con contador */}
      <Link
        href="/carrito"
        className="fixed top-4 right-4 bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 flex items-center gap-2"
      >
        🛒
        {totalItems > 0 && (
          <span className="bg-white text-blue-600 font-bold px-2 py-1 rounded-full text-sm">
            {totalItems}
          </span>
        )}
      </Link>

      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🛍️ Catálogo de Productos
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productos.map((p) => (
          <article
            key={p.id}
            className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition"
          >
            <div className="w-full bg-gray-100 flex items-center justify-center h-60 overflow-hidden">
              <Image
                src={srcFor(p)}
                alt={p.titulo}
                width={200}
                height={200}
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="font-semibold text-lg">{p.titulo}</h2>
              <p className="text-sm text-gray-600 flex-grow mt-2">
                {p.descripcion}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-bold text-blue-700">${p.precio}</span>
                <button
                  onClick={() => addToCart(p)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                >
                  Agregar 🛒
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
