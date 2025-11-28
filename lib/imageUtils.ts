import { PLACEHOLDER_IMAGES } from "./constants";

export function isValidImageUrl(imageUrl: string | undefined | null): boolean {
  if (!imageUrl || imageUrl.trim() === "") return false;
  
  const invalidUrls = [
    PLACEHOLDER_IMAGES.DEFAULT,
    "placehold.co",
  ];
  
  return !invalidUrls.some((invalid) => imageUrl.includes(invalid));
}

export function getValidImageUrl(
  imageUrl: string | undefined | null,
  placeholder: keyof typeof PLACEHOLDER_IMAGES = "WINE"
): string {
  return isValidImageUrl(imageUrl) 
    ? imageUrl! 
    : PLACEHOLDER_IMAGES[placeholder];
}

export function getWineImageAlt(
  marca: string,
  winery?: string,
  vintage?: number
): string {
  const parts = [marca];
  
  if (winery) parts.push(winery);
  if (vintage) parts.push(vintage.toString());
  
  return parts.join(" - ");
}

