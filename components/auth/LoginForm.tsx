"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useAuth } from "@/hooks/useAuth";
import { parseAuthError, validateLoginFields } from "@/lib/authHelpers";
import { ErrorAlert } from "./shared/ErrorAlert";
import { LoadingSpinner } from "./shared/LoadingSpinner";
import { GoogleIcon } from "./shared/GoogleIcon";

export default function LoginForm() {
  const { signIn, signInWithGoogle, loading, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const validationError = validateLoginFields(email, password);
    if (validationError) {
      setLoginError(validationError);
      return;
    }

    const result = await signIn({ email, password });
    if (!result.success) {
      setLoginError(parseAuthError(result.error));
    }
  };

  const handleGoogleSignIn = async () => {
    setLoginError(null);
    const result = await signInWithGoogle();
    if (!result.success) {
      setLoginError("Error al iniciar sesión con Google");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center">
            <span className="text-4xl">🍷</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            La Pertenencia
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Panel de Administración de Vinos
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input name="remember" type="hidden" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label className="sr-only" htmlFor="email-address">
                Email
              </label>
              <input
                required
                autoComplete="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                id="email-address"
                name="email"
                placeholder="Email del administrador"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="password">
                Contraseña
              </label>
              <input
                required
                autoComplete="current-password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                id="password"
                name="password"
                placeholder="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {loginError && <ErrorAlert message={loginError} />}

          <div>
            <button
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <span className="flex items-center">
                  <LoadingSpinner />
                  Iniciando sesión...
                </span>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                O continúa con
              </span>
            </div>
          </div>

          <div>
            <button
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={loading}
              type="button"
              onClick={handleGoogleSignIn}
            >
              <GoogleIcon />
              Google
            </button>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
              <p className="font-medium text-blue-800 mb-2">
                💡 Para convertirte en administrador:
              </p>
              <ol className="text-left space-y-1 text-blue-700">
                <li>1. Inicia sesión primero</li>
                <li>2. Copia tu UID que aparecerá</li>
                <li>3. Actualiza las reglas de Firebase</li>
                <li>4. ¡Listo para administrar vinos!</li>
              </ol>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
