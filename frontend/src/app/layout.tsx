import "../styles/global.css";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/navbar"; // 👈 minúscula

export const metadata = {
  title: "Ecommerce TP6",
  description: "Trabajo práctico 6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900">
        <CartProvider>
          <Navbar />
          <main className="p-6">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
