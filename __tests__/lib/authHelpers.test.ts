import { parseAuthError, validateLoginFields } from "@/lib/authHelpers";

describe("authHelpers", () => {
  describe("parseAuthError", () => {
    it("should return default error message when error is undefined", () => {
      expect(parseAuthError(undefined)).toBe("Error al iniciar sesión");
    });

    it("should return default error message when error is empty", () => {
      expect(parseAuthError("")).toBe("Error al iniciar sesión");
    });

    it("should parse invalid-credential error", () => {
      expect(parseAuthError("auth/invalid-credential")).toBe(
        "Email o contraseña incorrectos",
      );
    });

    it("should parse user-not-found error", () => {
      expect(parseAuthError("auth/user-not-found")).toBe(
        "Email o contraseña incorrectos",
      );
    });

    it("should parse invalid-email error", () => {
      expect(parseAuthError("auth/invalid-email")).toBe(
        "El formato del email no es válido",
      );
    });

    it("should parse too-many-requests error", () => {
      expect(parseAuthError("auth/too-many-requests")).toBe(
        "Demasiados intentos. Por favor, intenta más tarde",
      );
    });

    it("should return generic error for unknown errors", () => {
      expect(parseAuthError("auth/unknown-error")).toBe(
        "Error al iniciar sesión. Verifica tus credenciales",
      );
    });

    it("should handle error strings that contain error codes", () => {
      expect(parseAuthError("Error: auth/invalid-credential")).toBe(
        "Email o contraseña incorrectos",
      );
    });
  });

  describe("validateLoginFields", () => {
    it("should return null when both fields are provided", () => {
      expect(validateLoginFields("test@example.com", "password123")).toBe(
        null,
      );
    });

    it("should return error when email is empty", () => {
      expect(validateLoginFields("", "password123")).toBe(
        "Por favor, completa todos los campos",
      );
    });

    it("should return error when password is empty", () => {
      expect(validateLoginFields("test@example.com", "")).toBe(
        "Por favor, completa todos los campos",
      );
    });

    it("should return error when both fields are empty", () => {
      expect(validateLoginFields("", "")).toBe(
        "Por favor, completa todos los campos",
      );
    });

    it("should accept non-empty strings as valid", () => {
      expect(validateLoginFields("   ", "password123")).toBe(null);
      expect(validateLoginFields("test@example.com", "   ")).toBe(null);
    });
  });
});

