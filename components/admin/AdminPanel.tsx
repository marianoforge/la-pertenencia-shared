"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";

import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";


const WineAdminPanel = dynamic(() => import("./WineAdminPanel"), {
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  ),
  ssr: false,
});

const ComboAdminPanel = dynamic(() => import("./ComboAdminPanel"), {
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  ),
  ssr: false,
});

const SuscriptosAdminPanel = dynamic(() => import("./SuscriptosAdminPanel"), {
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  ),
  ssr: false,
});

const OrdersAdminPanel = dynamic(() => import("./OrdersAdminPanel"), {
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  ),
  ssr: false,
});

const OtrosAdminPanel = dynamic(() => import("./OtrosAdminPanel"), {
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  ),
  ssr: false,
});

type TabType = "wines" | "combos" | "suscriptos" | "orders" | "otros";

export default function AdminPanel() {
  const { user, logout, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const [activeTab, setActiveTab] = useState<TabType>("wines");
  const router = useRouter();

  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-700">Verificando permisos...</div>
        </div>
      </div>
    );
  }

  
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  🍷 Panel de Administración
                </h1>
                {isAdmin && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Admin Activo
                  </span>
                )}
              </div>
              <p className="text-gray-600 mt-1">
                La Pertenencia - Gestión de Contenido
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">
                  {user.displayName || "Usuario"}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Button
                color="danger"
                size="sm"
                variant="flat"
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {}
        <Card className="mb-6 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex space-x-1">
              <Button
                variant={activeTab === "wines" ? "solid" : "light"}
                color={activeTab === "wines" ? "primary" : "default"}
                onPress={() => setActiveTab("wines")}
                className="px-6"
              >
                🍷 Vinos
              </Button>
              <Button
                variant={activeTab === "combos" ? "solid" : "light"}
                color={activeTab === "combos" ? "primary" : "default"}
                onPress={() => setActiveTab("combos")}
                className="px-6"
              >
                📦 Combos
              </Button>
              <Button
                variant={activeTab === "suscriptos" ? "solid" : "light"}
                color={activeTab === "suscriptos" ? "primary" : "default"}
                onPress={() => setActiveTab("suscriptos")}
                className="px-6"
              >
                📧 Suscriptores
              </Button>
              <Button
                variant={activeTab === "orders" ? "solid" : "light"}
                color={activeTab === "orders" ? "primary" : "default"}
                onPress={() => setActiveTab("orders")}
                className="px-6"
              >
                🛒 Pedidos
              </Button>
              <Button
                variant={activeTab === "otros" ? "solid" : "light"}
                color={activeTab === "otros" ? "primary" : "default"}
                onPress={() => setActiveTab("otros")}
                className="px-6"
              >
                ⚙️ Otros
              </Button>
            </div>
          </div>
        </Card>

        {}
        {activeTab === "wines" && <WineAdminPanel />}
        {activeTab === "combos" && <ComboAdminPanel />}
        {activeTab === "suscriptos" && <SuscriptosAdminPanel />}
        {activeTab === "orders" && <OrdersAdminPanel />}
        {activeTab === "otros" && <OtrosAdminPanel />}
      </div>
    </div>
  );
}
