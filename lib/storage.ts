import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
} from "firebase/storage";

import { storage } from "@/lib/firebase";


const STORAGE_PATHS = {
  WINES: "images/wines",
  CATEGORIES: "images/categories",
  USERS: "images/users",
  GALLERY: "images/gallery",
} as const;




export const uploadWineImage = async (
  file: File,
  wineId: string,
): Promise<string | null> => {
  try {
    const timestamp = Date.now();
    const fileName = `${wineId}_${timestamp}.${file.name.split(".").pop()}`;
    const imageRef = ref(storage, `${STORAGE_PATHS.WINES}/${fileName}`);

    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("✅ Wine image uploaded:", downloadURL);

    return downloadURL;
  } catch (error) {
    console.error("❌ Error uploading wine image:", error);

    return null;
  }
};


export const uploadCategoryImage = async (
  file: File,
  categoryName: string,
): Promise<string | null> => {
  try {
    const timestamp = Date.now();
    const fileName = `${categoryName}_${timestamp}.${file.name.split(".").pop()}`;
    const imageRef = ref(storage, `${STORAGE_PATHS.CATEGORIES}/${fileName}`);

    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("✅ Category image uploaded:", downloadURL);

    return downloadURL;
  } catch (error) {
    console.error("❌ Error uploading category image:", error);

    return null;
  }
};


export const uploadGalleryImage = async (
  file: File,
  imageName?: string,
): Promise<string | null> => {
  try {
    const timestamp = Date.now();
    const fileName = imageName
      ? `${imageName}_${timestamp}.${file.name.split(".").pop()}`
      : `gallery_${timestamp}.${file.name.split(".").pop()}`;
    const imageRef = ref(storage, `${STORAGE_PATHS.GALLERY}/${fileName}`);

    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("✅ Gallery image uploaded:", downloadURL);

    return downloadURL;
  } catch (error) {
    console.error("❌ Error uploading gallery image:", error);

    return null;
  }
};


export const uploadUserAvatar = async (
  file: File,
  userId: string,
): Promise<string | null> => {
  try {
    const fileName = `${userId}_avatar.${file.name.split(".").pop()}`;
    const imageRef = ref(storage, `${STORAGE_PATHS.USERS}/${fileName}`);

    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("✅ User avatar uploaded:", downloadURL);

    return downloadURL;
  } catch (error) {
    console.error("❌ Error uploading user avatar:", error);

    return null;
  }
};




export const deleteImageByUrl = async (imageUrl: string): Promise<boolean> => {
  try {
    const imageRef = ref(storage, imageUrl);

    await deleteObject(imageRef);

    console.log("✅ Image deleted:", imageUrl);

    return true;
  } catch (error) {
    console.error("❌ Error deleting image:", error);

    return false;
  }
};


export const deleteWineImage = async (fileName: string): Promise<boolean> => {
  try {
    const imageRef = ref(storage, `${STORAGE_PATHS.WINES}/${fileName}`);

    await deleteObject(imageRef);

    console.log("✅ Wine image deleted:", fileName);

    return true;
  } catch (error) {
    console.error("❌ Error deleting wine image:", error);

    return false;
  }
};




export const getWineImages = async (): Promise<string[]> => {
  try {
    const winesRef = ref(storage, STORAGE_PATHS.WINES);
    const result = await listAll(winesRef);

    const urls = await Promise.all(
      result.items.map(async (itemRef) => {
        return await getDownloadURL(itemRef);
      }),
    );

    return urls;
  } catch (error) {
    console.error("❌ Error getting wine images:", error);

    return [];
  }
};


export const getGalleryImages = async (): Promise<string[]> => {
  try {
    const galleryRef = ref(storage, STORAGE_PATHS.GALLERY);
    const result = await listAll(galleryRef);

    const urls = await Promise.all(
      result.items.map(async (itemRef) => {
        return await getDownloadURL(itemRef);
      }),
    );

    return urls;
  } catch (error) {
    console.error("❌ Error getting gallery images:", error);

    return [];
  }
};




export const getImageMetadata = async (imagePath: string) => {
  try {
    const imageRef = ref(storage, imagePath);
    const metadata = await getMetadata(imageRef);

    return {
      name: metadata.name,
      size: metadata.size,
      contentType: metadata.contentType,
      timeCreated: metadata.timeCreated,
      updated: metadata.updated,
    };
  } catch (error) {
    console.error("❌ Error getting image metadata:", error);

    return null;
  }
};




export const validateImageFile = (file: File): boolean => {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; 

  if (!validTypes.includes(file.type)) {
    console.error(
      "❌ Invalid file type. Only JPEG, PNG, and WebP are allowed.",
    );

    return false;
  }

  if (file.size > maxSize) {
    console.error("❌ File too large. Maximum size is 5MB.");

    return false;
  }

  return true;
};


export const generateFileName = (
  originalName: string,
  prefix?: string,
): string => {
  const timestamp = Date.now();
  const extension = originalName.split(".").pop();
  const baseName = originalName.split(".")[0].replace(/[^a-zA-Z0-9]/g, "_");

  return prefix
    ? `${prefix}_${baseName}_${timestamp}.${extension}`
    : `${baseName}_${timestamp}.${extension}`;
};
