import { useState, useEffect } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface SignUpData {
  email: string;
  password: string;
  displayName?: string;
}

interface SignInData {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState({
        user,
        loading: false,
        error: null,
      });
    });

    return () => unsubscribe();
  }, []);

  // Sign up with email and password
  const signUp = async ({ email, password, displayName }: SignUpData) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }

      setAuthState((prev) => ({ ...prev, loading: false }));

      return { success: true, user: userCredential.user };
    } catch (error: any) {
      const errorMessage = error.message || "Error al crear la cuenta";

      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  };

  // Sign in with email and password
  const signIn = async ({ email, password }: SignInData) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      setAuthState((prev) => ({ ...prev, loading: false }));

      return { success: true, user: userCredential.user };
    } catch (error: any) {
      const errorMessage = error.message || "Error al iniciar sesión";

      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      setAuthState((prev) => ({ ...prev, loading: false }));

      return { success: true, user: userCredential.user };
    } catch (error: any) {
      const errorMessage =
        error.message || "Error al iniciar sesión con Google";

      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await signOut(auth);
      setAuthState((prev) => ({ ...prev, loading: false }));

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || "Error al cerrar sesión";

      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await sendPasswordResetEmail(auth, email);
      setAuthState((prev) => ({ ...prev, loading: false }));

      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error.message || "Error al enviar email de recuperación";

      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  };

  // Update user profile
  const updateUserProfile = async (data: {
    displayName?: string;
    photoURL?: string;
  }) => {
    try {
      if (!authState.user) {
        throw new Error("No hay usuario autenticado");
      }

      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await updateProfile(authState.user, data);
      setAuthState((prev) => ({ ...prev, loading: false }));

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || "Error al actualizar perfil";

      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  };

  // Clear error
  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    isAuthenticated: !!authState.user,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    clearError,
  };
};
