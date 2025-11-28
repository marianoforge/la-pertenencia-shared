"use client";

import { useState, useEffect } from "react";
import { Card } from "@heroui/card";
import { Switch } from "@heroui/switch";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { extractNumbers } from "@/lib/adminHelpers";
import { DEFAULT_SHIPPING_SETTINGS } from "@/lib/adminConstants";

interface SiteSettings {
  shippingEnabled: boolean;
  shippingCost: number;
}

export default function OtrosAdminPanel() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SHIPPING_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tempShippingCost, setTempShippingCost] = useState(
    DEFAULT_SHIPPING_SETTINGS.shippingCost.toString()
  );

  // Cargar configuración actual desde Firestore
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsRef = doc(db, "settings", "site");
      const settingsDoc = await getDoc(settingsRef);

      if (settingsDoc.exists()) {
        const data = settingsDoc.data() as SiteSettings;
        const settingsWithDefaults = {
          shippingEnabled: data.shippingEnabled ?? DEFAULT_SHIPPING_SETTINGS.shippingEnabled,
          shippingCost: data.shippingCost ?? DEFAULT_SHIPPING_SETTINGS.shippingCost,
        };
        setSettings(settingsWithDefaults);
        setTempShippingCost(settingsWithDefaults.shippingCost.toString());
      }
    } catch (error) {
      console.error("Error al cargar configuración:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShippingToggle = async (enabled: boolean) => {
    setSaving(true);

    try {
      const settingsRef = doc(db, "settings", "site");
      const newSettings = { ...settings, shippingEnabled: enabled };

      await setDoc(settingsRef, newSettings, { merge: true });
      setSettings(newSettings);

      // Mostrar confirmación
      alert(
        enabled
          ? "Costo de envío habilitado correctamente"
          : "Envío gratis habilitado correctamente"
      );
    } catch (error) {
      console.error("Error al guardar configuración:", error);
      alert("Error al guardar la configuración. Por favor, intenta nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleShippingCostChange = (value: string) => {
    setTempShippingCost(extractNumbers(value));
  };

  const handleSaveShippingCost = async () => {
    const cost = parseInt(tempShippingCost, 10);

    if (isNaN(cost) || cost < 0) {
      alert("Por favor, ingresa un costo válido");
      return;
    }

    setSaving(true);

    try {
      const settingsRef = doc(db, "settings", "site");
      const newSettings = { ...settings, shippingCost: cost };

      await setDoc(settingsRef, newSettings, { merge: true });
      setSettings(newSettings);

      alert(`Costo de envío actualizado a $${cost.toLocaleString()}`);
    } catch (error) {
      console.error("Error al guardar costo de envío:", error);
      alert("Error al guardar el costo. Por favor, intenta nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ⚙️ Configuración General
            </h2>
            <p className="text-gray-600">
              Administra la configuración general del sitio
            </p>
          </div>

          {/* Sección de Envío */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📦 Configuración de Envío
            </h3>

            <Card className="bg-gray-50 border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 mb-2">
                      Costo de Envío
                    </h4>
                    <p className="text-sm text-gray-600 max-w-xl">
                      {settings.shippingEnabled ? (
                        <>
                          El costo de envío está{" "}
                          <span className="font-semibold text-green-700">
                            habilitado
                          </span>
                          . Se calculará y cobrará según el código postal del
                          cliente.
                        </>
                      ) : (
                        <>
                          El envío está configurado como{" "}
                          <span className="font-semibold text-blue-700">
                            GRATIS
                          </span>
                          . No se cobrará costo de envío a los clientes.
                        </>
                      )}
                    </p>
                  </div>

                  <div className="ml-6">
                    <Switch
                      isSelected={settings.shippingEnabled}
                      onValueChange={handleShippingToggle}
                      isDisabled={saving}
                      size="lg"
                      color="success"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {settings.shippingEnabled
                          ? "Costo de envío activo"
                          : "Envío gratis activo"}
                      </span>
                    </Switch>
                  </div>
                </div>

                {/* Indicador visual del estado */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        settings.shippingEnabled
                          ? "bg-green-500 animate-pulse"
                          : "bg-blue-500 animate-pulse"
                      }`}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      Estado actual:{" "}
                      <span
                        className={
                          settings.shippingEnabled
                            ? "text-green-700"
                            : "text-blue-700"
                        }
                      >
                        {settings.shippingEnabled
                          ? `Cobrando envío fijo de $${(settings.shippingCost || 500).toLocaleString()}`
                          : "Envío gratis para todos los pedidos"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Configuración del Monto de Envío */}
            <Card className="bg-gray-50 border border-gray-200 mt-4">
              <div className="p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 mb-2">
                      💰 Monto de Envío
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Configura el costo único de envío que se aplicará a todos
                      los pedidos cuando el envío esté habilitado.
                    </p>

                    <div className="flex items-end gap-3 max-w-md">
                      <div className="flex-1">
                        <label
                          htmlFor="shippingCost"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Costo de envío ($)
                        </label>
                        <input
                          type="text"
                          id="shippingCost"
                          value={tempShippingCost}
                          onChange={(e) =>
                            handleShippingCostChange(e.target.value)
                          }
                          disabled={saving}
                          placeholder="500"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 font-medium text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      <button
                        onClick={handleSaveShippingCost}
                        disabled={
                          saving ||
                          tempShippingCost === settings.shippingCost.toString()
                        }
                        className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors h-[42px]"
                      >
                        {saving ? "Guardando..." : "Guardar"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Vista previa del costo */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Costo actual:{" "}
                      <span className="text-indigo-700 text-lg font-bold">
                        ${(settings.shippingCost || 500).toLocaleString()}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Información adicional */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">
                    Información importante
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>
                      Los cambios se aplican inmediatamente en el carrito de
                      compras
                    </li>
                    <li>
                      Si desactivas el costo de envío, se mostrará &quot;Envío
                      Gratis&quot; en el carrito
                    </li>
                    <li>
                      Si activas el costo de envío, se aplicará el monto fijo
                      configurado a todos los pedidos
                    </li>
                    <li>
                      Puedes cambiar el monto del envío en cualquier momento
                      desde la sección &quot;💰 Monto de Envío&quot;
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

