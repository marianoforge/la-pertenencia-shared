import { useState } from "react";
import { Button } from "@heroui/button";
import Image from "next/image";

interface ImageUploaderProps {
  currentImage?: string;
  onFileSelect: (file: File) => void;
  label: string;
  accept?: string;
  maxSizeMB?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onFileSelect,
  label,
  accept = "image/png,image/jpeg,image/jpg,image/webp",
  maxSizeMB = 5,
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`El archivo debe ser menor a ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen");
      return;
    }

    setError("");
    onFileSelect(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div className="flex items-start gap-4">
        {preview && (
          <div className="relative w-24 h-24 border rounded overflow-hidden">
            <Image alt="Preview" className="object-cover" fill src={preview} />
          </div>
        )}

        <div className="flex-1">
          <input
            accept={accept}
            className="hidden"
            id="image-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="image-upload">
            <Button as="span" color="default" size="sm">
              Seleccionar Imagen
            </Button>
          </label>

          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

          <p className="text-xs text-gray-500 mt-2">
            Máximo {maxSizeMB}MB. Formatos: JPG, PNG, WebP
          </p>
        </div>
      </div>
    </div>
  );
};
