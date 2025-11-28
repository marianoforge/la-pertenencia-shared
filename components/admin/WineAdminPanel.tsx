"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";

import { useAuth } from "@/hooks/useAuth";
import {
  useWines,
  useCreateWine,
  useUpdateWine,
  useDeleteWine,
} from "@/hooks/useWines";
import { usePagination } from "@/hooks/usePagination";
import { uploadWineImage, validateImageFile } from "@/lib/storage";
import { generateWineId } from "@/lib/firestore";
import { confirmDelete } from "@/lib/adminUtils";
import { cleanOptionalFields } from "@/lib/adminHelpers";
import { DEFAULT_WINE_VALUES, ITEMS_PER_PAGE } from "@/lib/adminConstants";
import { Wine } from "@/types/wine";
import {
  AdminLoadingState,
  AdminEmptyState,
  AdminSearchBar,
  AdminPagination,
} from "./shared";
import { WineForm, WinesTable } from "./wines";

export default function WineAdminPanel() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingWine, setEditingWine] = useState<Wine | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [wineForm, setWineForm] = useState<Partial<Wine>>(DEFAULT_WINE_VALUES);
  const [searchTerm, setSearchTerm] = useState("");

  // TanStack Query hooks
  const {
    data: wines = [],
    isLoading: winesLoading,
    error: winesError,
  } = useWines();
  const createWineMutation = useCreateWine();
  const updateWineMutation = useUpdateWine();
  const deleteWineMutation = useDeleteWine();

  // Paginación
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedWines,
    setCurrentPage,
  } = usePagination({
    items: wines,
    itemsPerPage: ITEMS_PER_PAGE,
    searchTerm,
    searchFields: ["marca", "bodega", "tipo", "varietal", "region"],
  });

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!wineForm.marca?.trim()) newErrors.marca = "La marca es requerida";
    if (!wineForm.bodega?.trim()) newErrors.bodega = "La bodega es requerida";
    if (!wineForm.tipo) newErrors.tipo = "El tipo es requerido";
    if (!wineForm.varietal) newErrors.varietal = "El varietal es requerido";
    if ((wineForm.price || 0) <= 0)
      newErrors.price = "El precio debe ser mayor a 0";
    if ((wineForm.cost || 0) <= 0)
      newErrors.cost = "El costo debe ser mayor a 0";
    if ((wineForm.iva || 0) < 0 || (wineForm.iva || 0) > 50) {
      newErrors.iva = "El IVA debe estar entre 0% y 50%";
    }
    if ((wineForm.stock || 0) < 0)
      newErrors.stock = "El stock no puede ser negativo";
    if (!wineForm.region?.trim()) newErrors.region = "La región es requerida";
    if (
      (wineForm.vintage || 0) < 1900 ||
      (wineForm.vintage || 0) > new Date().getFullYear() + 1
    ) {
      newErrors.vintage = "El año debe ser válido";
    }
    if ((wineForm.alcohol || 0) <= 0 || (wineForm.alcohol || 0) > 20) {
      newErrors.alcohol = "El alcohol debe estar entre 0 y 20%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Resetear formulario
  const resetForm = () => {
    setWineForm(DEFAULT_WINE_VALUES);
    setSelectedFile(null);
    setEditingWine(null);
    setShowForm(false);
    setErrors({});
  };

  // Manejar cambios en el formulario
  const handleInputChange = (field: string, value: any) => {
    setWineForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Manejar submit del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setUploading(true);

    try {
      let imageUrl = wineForm.image || "/images/default-wine.jpg";

      // Subir imagen si se seleccionó una
      if (selectedFile) {
        if (!validateImageFile(selectedFile)) {
          alert("Archivo de imagen no válido");
          setUploading(false);
          return;
        }

        const imageId =
          editingWine?.id ||
          generateWineId(wineForm.marca!, wineForm.varietal!);
        const uploadedUrl = await uploadWineImage(selectedFile, imageId);

        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      } else if (editingWine) {
        imageUrl = editingWine.image;
      }

      // Preparar datos del vino
      const wineData = cleanOptionalFields({ ...wineForm, image: imageUrl }, [
        "maridaje",
        "description",
      ]) as any;

      if (editingWine) {
        await updateWineMutation.mutateAsync({
          id: editingWine.id,
          ...wineData,
        });
        alert("Vino actualizado exitosamente");
      } else {
        await createWineMutation.mutateAsync(wineData);
        alert("Vino creado exitosamente");
      }

      resetForm();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al procesar el vino");
    }

    setUploading(false);
  };

  // Editar vino
  const handleEdit = (wine: Wine) => {
    setWineForm({
      marca: wine.marca,
      bodega: wine.bodega,
      tipo: wine.tipo || "Tinto",
      varietal: wine.varietal || "Malbec",
      maridaje: wine.maridaje || "",
      description: wine.description || "",
      price: wine.price,
      cost: wine.cost,
      iva: wine.iva !== undefined ? wine.iva : 0,
      region: wine.region,
      vintage: wine.vintage,
      alcohol: wine.alcohol,
      stock: wine.stock,
      image: wine.image,
      featured: wine.featured,
      winery: wine.winery || "La Pertenencia",
    });
    setEditingWine(wine);
    setShowForm(true);
  };

  // Eliminar vino
  const handleDelete = async (wine: Wine) => {
    if (confirmDelete(`el vino "${wine.marca}"`)) {
      try {
        await deleteWineMutation.mutateAsync(wine.id);
        alert("Vino eliminado exitosamente");
      } catch (error) {
        console.error("Error deleting wine:", error);
        alert("Error al eliminar el vino");
      }
    }
  };

  // El AdminPanel padre ya maneja autenticación
  if (!user) return null;

  // Mostrar loading
  if (winesLoading) {
    return <AdminLoadingState message="Cargando vinos..." />;
  }

  // Mostrar error
  if (winesError) {
    return (
      <AdminEmptyState
        description="Por favor, verifica tu conexión a Firebase"
        title="Error al cargar vinos"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* UID para configurar como admin */}
      <Card className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Tu UID para configurar como admin:</strong>
            </p>
            <code className="text-xs bg-gray-800 text-green-400 p-2 rounded block mt-2">
              {user.uid}
            </code>
            <p className="text-xs text-yellow-600 mt-2">
              Copia este UID y úsalo en las reglas de Firebase para obtener
              permisos de administrador.
            </p>
          </div>
        </div>
      </Card>

      {/* Barra de búsqueda y botón agregar */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <AdminSearchBar
            placeholder="Buscar por marca, bodega, tipo, varietal o región..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
        <Button
          color="primary"
          size="lg"
          startContent={<span>+</span>}
          onPress={() => setShowForm(true)}
        >
          Agregar Vino
        </Button>
      </div>

      {/* Lista de vinos */}
      {paginatedWines.length === 0 ? (
        <AdminEmptyState
          actionLabel="Agregar primer vino"
          description={
            searchTerm
              ? "No hay vinos que coincidan con tu búsqueda"
              : "Comienza agregando tu primer vino a la colección"
          }
          title="No hay vinos"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <>
          <Card className="shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Vinos ({wines.length})</h2>
            </div>
            <WinesTable
              wines={paginatedWines}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </Card>

          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Modal de formulario */}
      <Modal
        isDismissable={false}
        isOpen={showForm}
        scrollBehavior="inside"
        size="3xl"
        onClose={resetForm}
      >
        <ModalContent>
          <ModalHeader>
            {editingWine ? "Editar Vino" : "Agregar Nuevo Vino"}
          </ModalHeader>
          <ModalBody>
            <WineForm
              errors={errors}
              uploading={uploading}
              wine={wineForm}
              onCancel={resetForm}
              onChange={handleInputChange}
              onFileSelect={setSelectedFile}
              onSubmit={handleSubmit}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
