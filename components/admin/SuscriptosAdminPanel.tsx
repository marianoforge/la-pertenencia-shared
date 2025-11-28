"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import {
  getAllNewsletterSubscriptions,
  unsubscribeFromNewsletter,
  NewsletterSubscription,
} from "@/lib/firestore";

export default function SuscriptosAdminPanel() {
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingEmail, setProcessingEmail] = useState<string | null>(null);

  // Cargar suscriptores al montar el componente
  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllNewsletterSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      console.error("Error loading subscriptions:", err);
      setError("Error al cargar los suscriptores");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (email: string) => {
    if (!confirm(`¿Estás seguro de desuscribir a ${email}?`)) {
      return;
    }

    setProcessingEmail(email);
    try {
      const success = await unsubscribeFromNewsletter(email);
      if (success) {
        alert("Usuario desuscripto exitosamente");
        await loadSubscriptions();
      } else {
        alert("Error al desuscribir usuario");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error al desuscribir usuario");
    } finally {
      setProcessingEmail(null);
    }
  };

  const handleExportCSV = () => {
    if (subscriptions.length === 0) {
      alert("No hay suscriptores para exportar");
      return;
    }

    // Crear CSV
    const headers = ["Email", "Fecha de Suscripción", "Estado"];
    const rows = subscriptions.map((sub) => [
      sub.email,
      new Date(sub.subscribedAt).toLocaleString("es-AR"),
      sub.active ? "Activo" : "Inactivo",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `suscriptores-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Estados de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando suscriptores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button color="primary" onPress={loadSubscriptions}>
          Reintentar
        </Button>
      </Card>
    );
  }

  const activeSubscriptions = subscriptions.filter((sub) => sub.active);
  const inactiveSubscriptions = subscriptions.filter((sub) => !sub.active);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Total Suscriptores
              </p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {subscriptions.length}
              </p>
            </div>
            <div className="text-4xl">📧</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Activos</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {activeSubscriptions.length}
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactivos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {inactiveSubscriptions.length}
              </p>
            </div>
            <div className="text-4xl">❌</div>
          </div>
        </Card>
      </div>

      {/* Actions Bar */}
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Lista de Suscriptores
            </h2>
            <p className="text-sm text-gray-500">
              Administra todos los suscriptores del newsletter
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              color="primary"
              variant="flat"
              onPress={loadSubscriptions}
              isLoading={loading}
            >
              🔄 Actualizar
            </Button>
            <Button
              color="success"
              variant="flat"
              onPress={handleExportCSV}
              isDisabled={subscriptions.length === 0}
            >
              📥 Exportar CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* Subscriptions Table */}
      {subscriptions.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No hay suscriptores
          </h3>
          <p className="text-gray-500">
            Aún no hay personas suscritas al newsletter
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Suscripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions.map((subscription) => (
                  <tr
                    key={subscription.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {subscription.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(subscription.subscribedAt).toLocaleString(
                          "es-AR",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          subscription.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {subscription.active ? "✅ Activo" : "❌ Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {subscription.active ? (
                        <Button
                          size="sm"
                          color="danger"
                          variant="flat"
                          onPress={() => handleUnsubscribe(subscription.email)}
                          isLoading={processingEmail === subscription.email}
                          isDisabled={processingEmail !== null}
                        >
                          Desuscribir
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-xs">
                          Ya desuscripto
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
