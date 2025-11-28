"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";

import { useAuth } from "@/hooks/useAuth";
import {
  useCombos,
  useCreateCombo,
  useUpdateCombo,
  useDeleteCombo,
} from "@/hooks/useCombos";
import { useWines } from "@/hooks/useWines";
import { usePagination } from "@/hooks/usePagination";
import { uploadWineImage, validateImageFile } from "@/lib/storage";
import { confirmDelete } from "@/lib/adminUtils";
import { generateTempId } from "@/lib/adminHelpers";
import { DEFAULT_COMBO_VALUES, ITEMS_PER_PAGE } from "@/lib/adminConstants";
import { Combo } from "@/types/combo";
import {
  AdminLoadingState,
  AdminEmptyState,
  AdminSearchBar,
  AdminPagination,
} from "./shared";
import { ComboForm, CombosTable } from "./combos";

interface ComboFormData {
  name: string;
  selectedWineIds: string[];
  price: number;
  image: string;
  backgroundImage?: string;
  featured: boolean;
}

export default function ComboAdminPanel() {
  const { user, loading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const [comboForm, setComboForm] =
    useState<ComboFormData>(DEFAULT_COMBO_VALUES);

  
  const {
    data: combos = [],
    isLoading: combosLoading,
    error: combosError,
  } = useCombos();

  const { data: wines = [], isLoading: winesLoading } = useWines();

  const createComboMutation = useCreateCombo();
  const updateComboMutation = useUpdateCombo();
  const deleteComboMutation = useDeleteCombo();

  
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedCombos,
    setCurrentPage,
  } = usePagination({
    items: combos,
    itemsPerPage: ITEMS_PER_PAGE,
    searchTerm,
    searchFields: ["name"],
  });

  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!comboForm.name.trim()) {
      newErrors.name = "El nombre del combo es requerido";
    }

    if (comboForm.selectedWineIds.length === 0) {
      newErrors.wines = "Debe seleccionar al menos un vino";
    }

    if (comboForm.price <= 0) {
      newErrors.price = "El precio debe ser mayor a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const resetForm = () => {
    setComboForm(DEFAULT_COMBO_VALUES);
    setSelectedFile(null);
    setEditingCombo(null);
    setShowForm(false);
    setErrors({});
  };

  
  const handleInputChange = (field: string, value: any) => {
    setComboForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setUploading(true);

    try {
      let imageUrl = comboForm.image || "/images/imagen-combos.png";
      const backgroundImageUrl = "/images/fondo-combo.png"; 

      
      if (selectedFile) {
        if (!validateImageFile(selectedFile)) {
          alert("Archivo de imagen no válido");
          setUploading(false);
          return;
        }

        const tempId = editingCombo?.id || generateTempId("combo");
        const uploadedUrl = await uploadWineImage(selectedFile, tempId);

        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      
      const selectedWines = comboForm.selectedWineIds.map((wineId) => {
        const wine = wines.find((w) => w.id === wineId);
        if (!wine) {
          throw new Error(`Vino con ID ${wineId} no encontrado`);
        }
        return {
          id: wine.id,
          marca: wine.marca,
          image: wine.image,
        };
      });

      
      const comboData = {
        name: comboForm.name,
        wines: selectedWines,
        description: selectedWines.map((wine) => wine.marca),
        price: comboForm.price,
        image: imageUrl,
        backgroundImage: backgroundImageUrl,
        featured: comboForm.featured,
      };

      if (editingCombo) {
        await updateComboMutation.mutateAsync({
          id: editingCombo.id,
          ...comboData,
        });
        alert("Combo actualizado exitosamente");
      } else {
        await createComboMutation.mutateAsync({
          ...comboData,
          wineIds: comboForm.selectedWineIds,
        });
        alert("Combo creado exitosamente");
      }

      resetForm();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al procesar el combo");
    }

    setUploading(false);
  };

  
  const handleEdit = (combo: Combo) => {
    setComboForm({
      name: combo.name,
      selectedWineIds: combo.wines.map((wine) => wine.id),
      price: combo.price,
      image: combo.image,
      featured: combo.featured,
    });
    setEditingCombo(combo);
    setShowForm(true);
  };

  
  const handleDelete = async (combo: Combo) => {
    if (confirmDelete(`el combo "${combo.name}"`)) {
      try {
        await deleteComboMutation.mutateAsync(combo.id);
        alert("Combo eliminado exitosamente");
      } catch (error) {
        console.error("Error deleting combo:", error);
        alert("Error al eliminar el combo");
      }
    }
  };

  
  if (loading) {
    return <AdminLoadingState message="Cargando..." />;
  }

  if (!user) {
    return null;
  }

  
  if (combosLoading || winesLoading) {
    return <AdminLoadingState message="Cargando combos..." />;
  }

  
  if (combosError) {
    return (
      <AdminEmptyState
        description="Por favor, verifica tu conexión a Firebase"
        title="Error al cargar combos"
      />
    );
  }

  return (
    <div className="space-y-6">
      {}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <AdminSearchBar
            placeholder="Buscar combos por nombre..."
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
          Agregar Combo
        </Button>
      </div>

      {}
      {paginatedCombos.length === 0 ? (
        <AdminEmptyState
          actionLabel="Crear primer combo"
          description={
            searchTerm
              ? "No hay combos que coincidan con tu búsqueda"
              : "Comienza creando tu primer combo de vinos"
          }
          title="No hay combos"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <>
          <Card className="shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">
                Combos ({combos.length})
              </h2>
            </div>
            <CombosTable
              combos={paginatedCombos}
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

      {}
      <Modal
        isDismissable={false}
        isOpen={showForm}
        scrollBehavior="inside"
        size="3xl"
        onClose={resetForm}
      >
        <ModalContent>
          <ModalHeader>
            {editingCombo ? "Editar Combo" : "Agregar Nuevo Combo"}
          </ModalHeader>
          <ModalBody>
            <ComboForm
              combo={{
                ...comboForm,
                selectedWineIds: comboForm.selectedWineIds,
              }}
              errors={errors}
              uploading={uploading}
              wines={wines}
              onBgFileSelect={() => {}}
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
