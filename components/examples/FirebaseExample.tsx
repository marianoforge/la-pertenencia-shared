/**
 * Ejemplo de componente que demuestra el uso de Firebase
 * Este archivo muestra cómo integrar autenticación, Firestore y Storage
 */

"use client";

import { useState, useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { getAllWines, addWine, getFeaturedWines } from "@/lib/firestore";
import { uploadWineImage, validateImageFile } from "@/lib/storage";
import { Wine } from "@/types/wine";

export default function FirebaseExample() {
  const { user, signIn, signInWithGoogle, signUp, logout, loading } = useAuth();
  const [wines, setWines] = useState<Wine[]>([]);
  const [featuredWines, setFeaturedWines] = useState<Wine[]>([]);
  const [newWine, setNewWine] = useState({
    marca: "",
    bodega: "",
    description: "",
    price: 0,
    tipo: "Tinto" as const,
    varietal: "Malbec",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Cargar vinos al montar el componente
  useEffect(() => {
    loadWines();
    loadFeaturedWines();
  }, []);

  const loadWines = async () => {
    const winesData = await getAllWines();

    setWines(winesData);
  };

  const loadFeaturedWines = async () => {
    const featured = await getFeaturedWines();

    setFeaturedWines(featured);
  };

  // Manejar login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const result = await signIn({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (result.success) {
      console.log("✅ Usuario logueado");
    } else {
      console.error("❌ Error:", result.error);
    }
  };

  // Manejar registro
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const result = await signUp({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      displayName: formData.get("displayName") as string,
    });

    if (result.success) {
      console.log("✅ Usuario registrado");
    } else {
      console.error("❌ Error:", result.error);
    }
  };

  // Agregar nuevo vino
  const handleAddWine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Debes estar logueado para agregar vinos");

      return;
    }

    setUploading(true);
    let imageUrl = "/images/default-wine.jpg";

    // Subir imagen si se seleccionó una
    if (selectedFile) {
      if (!validateImageFile(selectedFile)) {
        setUploading(false);

        return;
      }

      const tempWineId = `wine-${Date.now()}`;
      const uploadedUrl = await uploadWineImage(selectedFile, tempWineId);

      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }

    // Crear el vino en Firestore
    const wineData = {
      marca: newWine.marca,
      bodega: newWine.bodega,
      tipo: newWine.tipo,
      varietal: newWine.varietal,
      description: newWine.description,
      price: newWine.price,
      image: imageUrl,
      cost: Math.round(newWine.price * 0.6), // 60% del precio como costo
      iva: 21,
      stock: 10,
      region: "Mendoza",
      vintage: new Date().getFullYear(),
      alcohol: 14.0,
      featured: false,
      winery: "La Pertenencia",
    };

    const wineId = await addWine(wineData);

    if (wineId) {
      console.log("✅ Vino agregado:", wineId);
      setNewWine({
        marca: "",
        bodega: "",
        description: "",
        price: 0,
        tipo: "Tinto" as const,
        varietal: "Malbec",
      });
      setSelectedFile(null);
      loadWines(); // Recargar lista
    }

    setUploading(false);
  };

  if (loading) {
    return <div className="p-4">Cargando...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">
        🔥 Firebase Integration Example
      </h1>

      {/* Sección de Autenticación */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">🔐 Autenticación</h2>

        {!user ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Login Form */}
            <form className="space-y-4" onSubmit={handleLogin}>
              <h3 className="text-lg font-medium">Iniciar Sesión</h3>
              <input
                required
                className="w-full p-2 border rounded"
                name="email"
                placeholder="Email"
                type="email"
              />
              <input
                required
                className="w-full p-2 border rounded"
                name="password"
                placeholder="Contraseña"
                type="password"
              />
              <button
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                type="submit"
              >
                Iniciar Sesión
              </button>
            </form>

            {/* SignUp Form */}
            <form className="space-y-4" onSubmit={handleSignUp}>
              <h3 className="text-lg font-medium">Registrarse</h3>
              <input
                required
                className="w-full p-2 border rounded"
                name="displayName"
                placeholder="Nombre completo"
                type="text"
              />
              <input
                required
                className="w-full p-2 border rounded"
                name="email"
                placeholder="Email"
                type="email"
              />
              <input
                required
                className="w-full p-2 border rounded"
                name="password"
                placeholder="Contraseña"
                type="password"
              />
              <button
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                type="submit"
              >
                Registrarse
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-lg">
              👋 Hola, <strong>{user.displayName || user.email}</strong>
            </p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={signInWithGoogle}
            >
              Conectar con Google
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
              onClick={logout}
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>

      {/* Agregar Vino (solo si está autenticado) */}
      {user && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">🍷 Agregar Vino</h2>

          <form className="space-y-4" onSubmit={handleAddWine}>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                required
                className="p-2 border rounded"
                placeholder="Marca del vino"
                type="text"
                value={newWine.marca}
                onChange={(e) =>
                  setNewWine({ ...newWine, marca: e.target.value })
                }
              />
              <input
                required
                className="p-2 border rounded"
                placeholder="Bodega"
                type="text"
                value={newWine.bodega}
                onChange={(e) =>
                  setNewWine({ ...newWine, bodega: e.target.value })
                }
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <select
                className="p-2 border rounded"
                value={newWine.tipo}
                onChange={(e) =>
                  setNewWine({ ...newWine, tipo: e.target.value as any })
                }
              >
                <option value="Tinto">Tinto</option>
                <option value="Blanco">Blanco</option>
                <option value="Red">Red</option>
                <option value="Blend">Blend</option>
                <option value="Rosado">Rosado</option>
                <option value="Espumante">Espumante</option>
                <option value="Naranjo">Naranjo</option>
              </select>
              <input
                required
                className="p-2 border rounded"
                placeholder="Varietal"
                type="text"
                value={newWine.varietal}
                onChange={(e) =>
                  setNewWine({ ...newWine, varietal: e.target.value })
                }
              />
            </div>

            <textarea
              required
              className="w-full p-2 border rounded"
              placeholder="Descripción"
              rows={3}
              value={newWine.description}
              onChange={(e) =>
                setNewWine({ ...newWine, description: e.target.value })
              }
            />

            <input
              required
              className="w-full p-2 border rounded"
              placeholder="Precio"
              type="number"
              value={newWine.price}
              onChange={(e) =>
                setNewWine({ ...newWine, price: Number(e.target.value) })
              }
            />

            <div>
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="wine-image"
              >
                Imagen del vino
              </label>
              <input
                accept="image/*"
                className="w-full p-2 border rounded"
                id="wine-image"
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>

            <button
              className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
              disabled={uploading}
              type="submit"
            >
              {uploading ? "Subiendo..." : "Agregar Vino"}
            </button>
          </form>
        </div>
      )}

      {/* Lista de Vinos Destacados */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">⭐ Vinos Destacados</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredWines.map((wine) => (
            <div key={wine.id} className="border rounded-lg p-4">
              <img
                alt={wine.marca}
                className="w-full h-48 object-cover rounded mb-2"
                src={wine.image}
              />
              <h3 className="font-semibold">{wine.marca}</h3>
              <p className="text-sm text-gray-600 mb-2">{wine.description}</p>
              <p className="font-bold text-lg">${wine.price}</p>
              <p className="text-sm text-gray-500">
                {wine.tipo} - {wine.region} {wine.vintage}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">📊 Estadísticas</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-100 p-4 rounded">
            <p className="text-2xl font-bold text-blue-600">{wines.length}</p>
            <p className="text-sm text-gray-600">Total Vinos</p>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <p className="text-2xl font-bold text-green-600">
              {featuredWines.length}
            </p>
            <p className="text-sm text-gray-600">Destacados</p>
          </div>
          <div className="bg-purple-100 p-4 rounded">
            <p className="text-2xl font-bold text-purple-600">
              {wines.filter((w) => w.tipo === "Tinto").length}
            </p>
            <p className="text-sm text-gray-600">Tintos</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded">
            <p className="text-2xl font-bold text-yellow-600">
              {wines.filter((w) => w.tipo === "Blanco").length}
            </p>
            <p className="text-sm text-gray-600">Blancos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
