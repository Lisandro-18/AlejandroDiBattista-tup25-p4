import { create } from "zustand";

interface Producto {
  id: number;
  titulo: string;
  precio: number;
  descripcion: string;
  imagen: string;
}

interface CarritoState {
  items: Producto[];
  agregar: (producto: Producto) => void;
  eliminar: (id: number) => void;
  vaciar: () => void;
}

export const useCarritoStore = create<CarritoState>((set) => ({
  items: [],
  agregar: (producto) =>
    set((state) => ({
      items: [...state.items, producto],
    })),
  eliminar: (id) =>
    set((state) => ({
      items: state.items.filter((p) => p.id !== id),
    })),
  vaciar: () => set({ items: [] }),
}));
