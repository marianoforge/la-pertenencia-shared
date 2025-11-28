import { formatPrice, formatNumber, formatDate } from "@/lib/formatters";

describe("formatters", () => {
  describe("formatPrice", () => {
    it("should format price with currency symbol", () => {
      expect(formatPrice(1000)).toMatch(/\$\s?1\.000/);
      expect(formatPrice(1234)).toMatch(/\$\s?1\.234/);
      expect(formatPrice(12345)).toMatch(/\$\s?12\.345/);
    });

    it("should handle zero", () => {
      expect(formatPrice(0)).toMatch(/\$\s?0/);
    });

    it("should handle large numbers", () => {
      expect(formatPrice(1000000)).toMatch(/\$\s?1\.000\.000/);
    });

    it("should handle decimal numbers", () => {
      const result = formatPrice(1234.56);
      expect(result).toMatch(/\$\s?1\./);
      expect(result).toBeTruthy();
    });
  });

  describe("formatNumber", () => {
    it("should format number with thousands separator", () => {
      expect(formatNumber(1000)).toBe("1.000");
      expect(formatNumber(1234)).toBe("1.234");
      expect(formatNumber(12345)).toBe("12.345");
    });

    it("should handle zero", () => {
      expect(formatNumber(0)).toBe("0");
    });

    it("should handle large numbers", () => {
      expect(formatNumber(1000000)).toBe("1.000.000");
    });
  });

  describe("formatDate", () => {
    it("should format date in Spanish", () => {
      const date = new Date("2024-01-15");
      const formatted = formatDate(date);
      expect(formatted).toContain("2024");
      expect(formatted).toContain("enero");
      expect(formatted).toContain("15");
    });

    it("should format date string", () => {
      const dateString = "2024-01-15T10:00:00Z";
      const formatted = formatDate(dateString);
      expect(formatted).toBeTruthy();
    });

    it("should accept custom options", () => {
      const date = new Date("2024-01-15");
      const formatted = formatDate(date, { year: "numeric", month: "short" });
      expect(formatted).toBeTruthy();
    });
  });
});

