import { useRouter } from "next/router";
import { Button } from "@heroui/button";

import DefaultLayout from "../../layouts/default";

export default function PaymentPending() {
  const router = useRouter();
  const { payment_id, status, external_reference } = router.query;

  return (
    <DefaultLayout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Pago Pendiente
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tu pago está siendo procesado
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  ID de Pago:
                </span>
                <span className="font-medium">{payment_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Estado:
                </span>
                <span className="font-medium text-yellow-600">{status}</span>
              </div>
              {external_reference && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Referencia:
                  </span>
                  <span className="font-medium">{external_reference}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tu pago está siendo verificado. Te notificaremos una vez que se
              complete el proceso.
            </p>

            <Button
              className="w-full"
              color="primary"
              size="lg"
              onClick={() => router.push("/")}
            >
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
