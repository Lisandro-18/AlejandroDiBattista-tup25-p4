"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();
  const totalItems = Array.isArray(cart)
    ? cart.reduce((acc, i) => acc + i.cantidad, 0)
    : 0;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex gap-4">
        <Link href="/" className="hover:underline">
          🏠 Inicio
        </Link>
        <Link href="/carrito" className="hover:underline">
          🛒 Carrito ({totalItems})
        </Link>
      </div>

      <div className="flex gap-4">
        <Link href="/login" className="hover:underline">
          🔑 Login
        </Link>
        <Link href="/registro" className="hover:underline">
          📝 Registro
        </Link>
        <button onClick={handleLogout} className="hover:underline text-red-200">
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}
