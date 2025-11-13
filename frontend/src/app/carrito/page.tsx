"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "../../context/CartContext";
import Link from "next/link";

export default function CarritoPage() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const total = cart.reduce(
    (acc, item) => acc + item.precio * (item.cantidad || 1),
    0
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
        <h1 className="text-3xl font-bold mb-4">🛒 Tu carrito está vacío</h1>
        <Link
          href="/"
          className="text-blue-600 underline hover:text-blue-800 mt-4"
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        🛒 Tu Carrito
      </h1>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b py-4"
          >
            <div className="flex items-center space-x-4">
              <Image
                src={
                  item.imagen?.startsWith("http")
                    ? item.imagen
                    : `http://127.0.0.1:8000/imagenes/${item.imagen}`
                }
                alt={item.titulo}
                width={80}
                height={80}
                className="rounded-md object-contain"
                unoptimized
              />
              <div>
                <h2 className="font-semibold text-gray-800">{item.titulo}</h2>
                <p className="text-gray-600">${item.precio}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => decreaseQuantity(item.id)}
                className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                -
              </button>
              <span className="font-semibold text-gray-800">
                {item.cantidad}
              </span>
              <button
                onClick={() => increaseQuantity(item.id)}
                className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                +
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <span className="font-bold text-blue-700">
                ${(item.precio * (item.cantidad || 1)).toFixed(2)}
              </span>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-6">
          <h2 className="text-xl font-bold text-gray-800">
            Total: ${total.toFixed(2)}
          </h2>
          <button
            onClick={clearCart}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Vaciar carrito
          </button>
        </div>

        <div className="flex justify-center mt-8">
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
