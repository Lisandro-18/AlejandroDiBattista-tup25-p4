// frontend/src/app/dashboard/productos/page.tsx
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Producto = {
  id: number;
  titulo: string;
  precio: number;
  descripcion?: string;
  categoria?: string;
  existencia?: number;
  imagen?: string;
};

export default function ProductosDashboard() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Producto | null>(null);
  const [form, setForm] = useState({
    titulo: "",
    precio: "",
    descripcion: "",
    categoria: "",
    existencia: "1",
    imagen: "",
  });

  const API = "http://127.0.0.1:8000/productos";

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      setProductos(data);
    } catch (e) {
      console.error(e);
      toast.error("Error cargando productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({
      titulo: "",
      precio: "",
      descripcion: "",
      categoria: "",
      existencia: "1",
      imagen: "",
    });
    setShowForm(true);
  };

  const openEdit = (p: Producto) => {
    setEditing(p);
    setForm({
      titulo: p.titulo || "",
      precio: String(p.precio || ""),
      descripcion: p.descripcion || "",
      categoria: p.categoria || "",
      existencia: String(p.existencia ?? 1),
      imagen: p.imagen
        ? p.imagen.replace("http://127.0.0.1:8000/imagenes/", "")
        : "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Borrar este producto?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("error");
      toast.success("Producto borrado");
      fetchProductos();
    } catch (e) {
      console.error(e);
      toast.error("Error al borrar");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo || !form.precio) {
      toast.error("Completá título y precio");
      return;
    }
    const payload = {
      titulo: form.titulo,
      precio: parseFloat(form.precio),
      descripcion: form.descripcion,
      categoria: form.categoria,
      existencia: parseInt(form.existencia || "0"),
      imagen: form.imagen, // puede ser "0001.png" o "/imagenes/0001.png" o URL completa
    };

    try {
      if (editing) {
        const res = await fetch(`${API}/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("error");
        toast.success("Producto actualizado");
      } else {
        const res = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("error");
        toast.success("Producto creado");
      }
      setShowForm(false);
      fetchProductos();
    } catch (err) {
      console.error(err);
      toast.error("Error guardando producto");
    }
  };

  return (
    <main className="p-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard - Productos</h1>
        <div>
          <button
            onClick={openNew}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Nuevo producto
          </button>
        </div>
      </header>

      <section>
        {loading ? (
          <p>Cargando...</p>
        ) : productos.length === 0 ? (
          <p>No hay productos</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {productos.map((p) => (
              <div key={p.id} className="border p-4 rounded shadow bg-white">
                <img
                  src={p.imagen || "/placeholder.png"}
                  alt={p.titulo}
                  className="w-full h-40 object-contain mb-2"
                />
                <h3 className="font-semibold">{p.titulo}</h3>
                <p className="text-sm text-gray-600">{p.descripcion}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-bold">${p.precio}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="bg-yellow-500 px-3 py-1 rounded text-white"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 px-3 py-1 rounded text-white"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow w-full max-w-xl"
          >
            <h2 className="text-xl font-bold mb-4">
              {editing ? "Editar producto" : "Nuevo producto"}
            </h2>

            <div className="grid grid-cols-1 gap-3">
              <input
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Título"
                className="border p-2 rounded"
              />
              <input
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
                placeholder="Precio"
                type="number"
                step="0.01"
                className="border p-2 rounded"
              />
              <input
                value={form.categoria}
                onChange={(e) =>
                  setForm({ ...form, categoria: e.target.value })
                }
                placeholder="Categoría"
                className="border p-2 rounded"
              />
              <input
                value={form.existencia}
                onChange={(e) =>
                  setForm({ ...form, existencia: e.target.value })
                }
                placeholder="Existencia"
                type="number"
                className="border p-2 rounded"
              />
              <input
                value={form.imagen}
                onChange={(e) => setForm({ ...form, imagen: e.target.value })}
                placeholder="Imagen (ej: 0001.png o /imagenes/0001.png o https://...)"
                className="border p-2 rounded"
              />
              <textarea
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
                placeholder="Descripción"
                className="border p-2 rounded"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded border"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                {editing ? "Guardar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
