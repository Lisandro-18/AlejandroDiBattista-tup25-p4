"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Producto = {
  id: number;
  titulo: string;
  precio: number;
  descripcion?: string;
  imagen?: string;
  cantidad?: number;
};

type CartContextType = {
  cart: Producto[];
  addToCart: (producto: Producto) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Producto[]>([]);

  // ✅ Mantener carrito entre recargas
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (producto: Producto) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === producto.id);
      if (existing) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: (p.cantidad || 1) + 1 } : p
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((p) => p.id !== id));

  const increaseQuantity = (id: number) =>
    setCart((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, cantidad: (p.cantidad || 1) + 1 } : p
      )
    );

  const decreaseQuantity = (id: number) =>
    setCart((prev) =>
      prev
        .map((p) =>
          p.id === id ? { ...p, cantidad: (p.cantidad || 1) - 1 } : p
        )
        .filter((p) => (p.cantidad || 0) > 0)
    );

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + (item.cantidad || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
};
