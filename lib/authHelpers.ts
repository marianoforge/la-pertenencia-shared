export function parseAuthError(error: string | undefined): string {
  if (!error) return "Error al iniciar sesión";

  if (
    error.includes("invalid-credential") ||
    error.includes("user-not-found")
  ) {
    return "Email o contraseña incorrectos";
  }

  if (error.includes("invalid-email")) {
    return "El formato del email no es válido";
  }

  if (error.includes("too-many-requests")) {
    return "Demasiados intentos. Por favor, intenta más tarde";
  }

  return "Error al iniciar sesión. Verifica tus credenciales";
}

export function validateLoginFields(
  email: string,
  password: string
): string | null {
  if (!email || !password) {
    return "Por favor, completa todos los campos";
  }
  return null;
}

