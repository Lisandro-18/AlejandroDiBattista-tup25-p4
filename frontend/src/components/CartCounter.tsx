"use client";
import Link from "next/link";
import React from "react";
import { useCart } from "../context/CartContext";

export default function CartCounter() {
  const { cart } = useCart();
  const count = Array.isArray(cart)
    ? cart.reduce((acc, it) => acc + (it.cantidad || 0), 0)
    : 0;

  return (
    <Link href="/carrito" className="relative inline-flex items-center">
      <span className="px-3 py-1 rounded-lg bg-white text-blue-600 font-semibold shadow">
        🛒 Carrito
      </span>
      {count > 0 && (
        <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
