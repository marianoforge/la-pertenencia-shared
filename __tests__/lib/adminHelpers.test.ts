import {
  calculateWineProfit,
  cleanOptionalFields,
  validateImage,
  generateTempId,
  numberToInputString,
  extractNumbers,
} from "@/lib/adminHelpers";

describe("adminHelpers", () => {
  describe("calculateWineProfit", () => {
    it("should calculate profit correctly", () => {
      const result = calculateWineProfit(1000, 500);
      expect(result.profit).toBe(500);
      expect(result.profitPercentage).toBe(100);
    });

    it("should calculate profit with IVA", () => {
      const result = calculateWineProfit(1000, 500, 21);
      expect(result.priceWithTax).toBe(1210);
      expect(result.profit).toBe(500);
    });

    it("should handle zero cost", () => {
      const result = calculateWineProfit(1000, 0);
      expect(result.profit).toBe(1000);
      expect(result.profitPercentage).toBe(0);
    });

    it("should handle negative profit", () => {
      const result = calculateWineProfit(500, 1000);
      expect(result.profit).toBe(-500);
      expect(result.profitPercentage).toBe(-50);
    });

    it("should calculate profit percentage correctly", () => {
      const result = calculateWineProfit(1500, 1000);
      expect(result.profitPercentage).toBe(50);
    });
  });

  describe("cleanOptionalFields", () => {
    it("should remove empty string fields", () => {
      const data = {
        name: "Test",
        description: "",
        maridaje: "   ",
        price: 1000,
      };

      const cleaned = cleanOptionalFields(data, ["description", "maridaje"]);

      expect(cleaned).not.toHaveProperty("description");
      expect(cleaned).not.toHaveProperty("maridaje");
      expect(cleaned).toHaveProperty("name");
      expect(cleaned).toHaveProperty("price");
    });

    it("should keep non-empty string fields", () => {
      const data = {
        name: "Test",
        description: "Valid description",
        price: 1000,
      };

      const cleaned = cleanOptionalFields(data, ["description"]);

      expect(cleaned).toHaveProperty("description");
      expect(cleaned.description).toBe("Valid description");
    });

    it("should not remove non-string fields", () => {
      const data = {
        name: "Test",
        price: 0,
        stock: 0,
      };

      const cleaned = cleanOptionalFields(data, ["price", "stock"]);

      expect(cleaned).toHaveProperty("price");
      expect(cleaned).toHaveProperty("stock");
    });

    it("should handle empty array of optional fields", () => {
      const data = { name: "Test", description: "" };
      const cleaned = cleanOptionalFields(data, []);

      expect(cleaned).toEqual(data);
    });
  });

  describe("validateImage", () => {
    it("should validate image file type", () => {
      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const result = validateImage(file);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should reject non-image files", () => {
      const file = new File(["test"], "test.pdf", { type: "application/pdf" });
      const result = validateImage(file);

      expect(result.valid).toBe(false);
      expect(result.error).toBe("El archivo debe ser una imagen");
    });

    it("should validate file size", () => {
      const largeFile = new File(["x".repeat(6 * 1024 * 1024)], "large.jpg", {
        type: "image/jpeg",
      });
      const result = validateImage(largeFile, 5);

      expect(result.valid).toBe(false);
      expect(result.error).toContain("menor a 5MB");
    });

    it("should accept files within size limit", () => {
      const file = new File(["x".repeat(2 * 1024 * 1024)], "test.jpg", {
        type: "image/jpeg",
      });
      const result = validateImage(file, 5);

      expect(result.valid).toBe(true);
    });

    it("should use custom max size", () => {
      const file = new File(["x".repeat(3 * 1024 * 1024)], "test.jpg", {
        type: "image/jpeg",
      });
      const result = validateImage(file, 2);

      expect(result.valid).toBe(false);
      expect(result.error).toContain("menor a 2MB");
    });
  });

  describe("generateTempId", () => {
    it("should generate ID with default prefix", () => {
      const id = generateTempId();
      expect(id).toMatch(/^temp-\d+$/);
    });

    it("should generate ID with custom prefix", () => {
      const id = generateTempId("wine");
      expect(id).toMatch(/^wine-\d+$/);
    });

    it("should generate IDs with timestamp", () => {
      const id = generateTempId();
      expect(id).toMatch(/^temp-\d+$/);
      const timestamp = parseInt(id.split("-")[1]);
      expect(timestamp).toBeGreaterThan(0);
    });
  });

  describe("numberToInputString", () => {
    it("should convert number to string", () => {
      expect(numberToInputString(100)).toBe("100");
    });

    it("should return empty string for undefined", () => {
      expect(numberToInputString(undefined)).toBe("");
    });

    it("should handle zero", () => {
      expect(numberToInputString(0)).toBe("0");
    });

    it("should handle negative numbers", () => {
      expect(numberToInputString(-10)).toBe("-10");
    });

    it("should handle decimal numbers", () => {
      expect(numberToInputString(10.5)).toBe("10.5");
    });
  });

  describe("extractNumbers", () => {
    it("should extract numbers from string", () => {
      expect(extractNumbers("abc123def456")).toBe("123456");
    });

    it("should return empty string for string with no numbers", () => {
      expect(extractNumbers("abcdef")).toBe("");
    });

    it("should handle string with only numbers", () => {
      expect(extractNumbers("123456")).toBe("123456");
    });

    it("should handle empty string", () => {
      expect(extractNumbers("")).toBe("");
    });

    it("should remove all non-numeric characters", () => {
      expect(extractNumbers("+54 9 11 1234-5678")).toBe("5491112345678");
    });
  });
});

