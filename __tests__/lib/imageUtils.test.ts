import {
  isValidImageUrl,
  getValidImageUrl,
  getWineImageAlt,
} from "@/lib/imageUtils";
import { PLACEHOLDER_IMAGES } from "@/lib/constants";

describe("imageUtils", () => {
  describe("isValidImageUrl", () => {
    it("should return false for undefined", () => {
      expect(isValidImageUrl(undefined)).toBe(false);
    });

    it("should return false for null", () => {
      expect(isValidImageUrl(null)).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(isValidImageUrl("")).toBe(false);
    });

    it("should return false for whitespace-only string", () => {
      expect(isValidImageUrl("   ")).toBe(false);
    });

    it("should return false for placeholder image URL", () => {
      expect(isValidImageUrl(PLACEHOLDER_IMAGES.DEFAULT)).toBe(false);
    });

    it("should return false for placehold.co URLs", () => {
      expect(isValidImageUrl("https://placehold.co/300x300")).toBe(false);
    });

    it("should return true for valid image URL", () => {
      expect(isValidImageUrl("https://example.com/image.jpg")).toBe(true);
    });

    it("should return true for Firebase Storage URL", () => {
      expect(
        isValidImageUrl(
          "https://firebasestorage.googleapis.com/v0/b/project.appspot.com/o/image.jpg",
        ),
      ).toBe(true);
    });
  });

  describe("getValidImageUrl", () => {
    it("should return valid URL when provided", () => {
      const validUrl = "https://example.com/image.jpg";
      expect(getValidImageUrl(validUrl)).toBe(validUrl);
    });

    it("should return placeholder for invalid URL", () => {
      expect(getValidImageUrl("")).toBe(PLACEHOLDER_IMAGES.WINE);
    });

    it("should return placeholder for undefined", () => {
      expect(getValidImageUrl(undefined)).toBe(PLACEHOLDER_IMAGES.WINE);
    });

    it("should return placeholder for null", () => {
      expect(getValidImageUrl(null)).toBe(PLACEHOLDER_IMAGES.WINE);
    });

    it("should return custom placeholder when specified", () => {
      expect(getValidImageUrl("", "DEFAULT")).toBe(PLACEHOLDER_IMAGES.DEFAULT);
    });

    it("should return placeholder for placehold.co URLs", () => {
      expect(getValidImageUrl("https://placehold.co/300x300")).toBe(
        PLACEHOLDER_IMAGES.WINE,
      );
    });
  });

  describe("getWineImageAlt", () => {
    it("should return only marca when no other info provided", () => {
      expect(getWineImageAlt("Test Wine")).toBe("Test Wine");
    });

    it("should include winery when provided", () => {
      expect(getWineImageAlt("Test Wine", "Test Winery")).toBe(
        "Test Wine - Test Winery",
      );
    });

    it("should include vintage when provided", () => {
      expect(getWineImageAlt("Test Wine", undefined, 2020)).toBe(
        "Test Wine - 2020",
      );
    });

    it("should include all information when all provided", () => {
      expect(getWineImageAlt("Test Wine", "Test Winery", 2020)).toBe(
        "Test Wine - Test Winery - 2020",
      );
    });

    it("should handle empty winery string", () => {
      expect(getWineImageAlt("Test Wine", "", 2020)).toBe("Test Wine - 2020");
    });

    it("should handle zero vintage", () => {
      const result = getWineImageAlt("Test Wine", "Test Winery", 0);
      expect(result).toBe("Test Wine - Test Winery");
    });
  });
});

