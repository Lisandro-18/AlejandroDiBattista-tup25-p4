import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Producto {
  id: number;
  titulo: string;
  precio: number;
  descripcion: string;
  imagen: string;
}

interface ProductoCarrito extends Producto {
  cantidad: number;
}

interface CarritoState {
  carrito: ProductoCarrito[];
  agregarProducto: (producto: Producto) => void;
  eliminarProducto: (id: number) => void;
  vaciarCarrito: () => void;
  aumentarCantidad: (id: number) => void;
  disminuirCantidad: (id: number) => void;
}

export const useCarritoStore = create<CarritoState>()(
  persist(
    (set) => ({
      carrito: [],

      agregarProducto: (producto) =>
        set((state) => {
          const existe = state.carrito.find((p) => p.id === producto.id);
          if (existe) {
            return {
              carrito: state.carrito.map((p) =>
                p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
              ),
            };
          } else {
            return {
              carrito: [...state.carrito, { ...producto, cantidad: 1 }],
            };
          }
        }),

      eliminarProducto: (id) =>
        set((state) => ({
          carrito: state.carrito.filter((p) => p.id !== id),
        })),

      vaciarCarrito: () => set({ carrito: [] }),

      aumentarCantidad: (id) =>
        set((state) => ({
          carrito: state.carrito.map((p) =>
            p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
          ),
        })),

      disminuirCantidad: (id) =>
        set((state) => ({
          carrito: state.carrito
            .map((p) => (p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p))
            .filter((p) => p.cantidad > 0),
        })),
    }),
    { name: "carrito-storage" }
  )
);
