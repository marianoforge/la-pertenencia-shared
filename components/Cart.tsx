import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useCartStore } from "@/stores/useCartStore";
import { useCheckout } from "@/hooks/useCheckout";
import { getSiteSettings } from "@/lib/firestore";
import { formatPrice } from "@/lib/formatters";

import { Button } from "./ui/Button";
import { CartItem } from "./cart/CartItem";
import { ShippingForm } from "./cart/ShippingForm";
import { EmptyCart } from "./cart/EmptyCart";

const Cart = () => {
  const {
    items,
    isOpen,
    totalItems,
    totalAmount,
    shippingInfo,
    toggleCart,
    updateQuantity,
    removeItem,
    clearCart,
    setShippingInfo,
  } = useCartStore();

  const {
    isProcessing,
    mpLoading,
    mpError,
    processMercadoPagoCheckout,
    processCustomCheckout,
  } = useCheckout();
  const [postalCode, setPostalCode] = useState("");
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [shippingEnabled, setShippingEnabled] = useState(true);
  const [configuredShippingCost, setConfiguredShippingCost] = useState(500);

  useEffect(() => {
    const loadShippingSettings = async () => {
      try {
        const settings = await getSiteSettings();
        setShippingEnabled(settings.shippingEnabled ?? true);
        setConfiguredShippingCost(settings.shippingCost ?? 500);
      } catch (error) {
        console.error("Error loading shipping settings:", error);
        setShippingEnabled(true);
        setConfiguredShippingCost(500);
      }
    };

    loadShippingSettings();
  }, []);

  const calculateShippingCost = (): number => {
    if (!shippingEnabled) return 0;
    return configuredShippingCost;
  };

  const handleCalculateShipping = () => {
    const cost = calculateShippingCost();
    setShippingCost(cost);
    setShippingInfo({ postalCode });
  };

  useEffect(() => {
    if (!isOpen) {
      setPostalCode("");
      setShippingCost(null);
    }
  }, [isOpen]);

  useEffect(() => {
    setShippingCost(null);
  }, [items.length]);

  const handleMercadoPagoCheckout = async () => {
    await processMercadoPagoCheckout(
      items,
      totalAmount,
      shippingInfo,
      shippingCost || 0
    );
  };

  const handleCustomCheckout = async () => {
    await processCustomCheckout(
      items,
      totalAmount,
      shippingInfo,
      shippingCost || 0
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.button
            animate={{ opacity: 1 }}
            aria-label="Cerrar carrito"
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={toggleCart}
          />

          {/* Cart Panel */}
          <motion.div
            animate={{ x: 0 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col font-['Lora']"
            exit={{ x: "100%" }}
            initial={{ x: "100%" }}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94], // easeOutCubic
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-xl font-semibold font-['Lora'] text-neutral-900 uppercase tracking-[3px]">
                Carrito ({totalItems})
              </h2>
              <button
                className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
                onClick={toggleCart}
              >
                <svg
                  fill="none"
                  height="16"
                  viewBox="0 0 16 16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4L4 12M4 4L12 12"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <EmptyCart />
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <CartItem
                      key={item.wine.id}
                      item={item}
                      onRemove={removeItem}
                      onUpdateQuantity={updateQuantity}
                    />
                  ))}

                  {/* Shipping Information */}
                  <ShippingForm
                    postalCode={postalCode}
                    shippingInfo={shippingInfo}
                    onCalculateShipping={handleCalculateShipping}
                    onPostalCodeChange={setPostalCode}
                    onShippingInfoChange={setShippingInfo}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-neutral-200 p-6 space-y-6">
                {/* Shipping Cost */}
                {shippingCost !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold font-['Lora'] text-neutral-900 uppercase tracking-[2px]">
                      Costo de Envío:
                    </span>
                    {!shippingEnabled || shippingCost === 0 ? (
                      <span className="text-lg font-bold font-['Lora'] text-green-700 tracking-wide">
                        Envío Gratis
                      </span>
                    ) : (
                      <span className="text-lg font-bold font-['Lora'] text-neutral-900 tracking-wide">
                        {formatPrice(shippingCost || 0)}
                      </span>
                    )}
                  </div>
                )}

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold font-['Lora'] text-neutral-900 uppercase tracking-[2px]">
                    Total:
                  </span>
                  <span className="text-xl font-bold font-['Lora'] text-yellow-700 tracking-wide">
                    {formatPrice(totalAmount + (shippingCost || 0))}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    className="w-full !max-w-none !tracking-[3px] disabled:bg-amber-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={
                      isProcessing ||
                      mpLoading ||
                      shippingCost === null ||
                      !shippingInfo.address.trim() ||
                      !shippingInfo.phone.trim() ||
                      !shippingInfo.postalCode.trim()
                    }
                    variant="primary"
                    onClick={handleMercadoPagoCheckout}
                  >
                    {isProcessing || mpLoading
                      ? "PROCESANDO..."
                      : "PAGAR CON MERCADO PAGO"}
                  </Button>

                  <Button
                    className="w-full !max-w-none !tracking-[3px] bg-neutral-100 hover:bg-neutral-200"
                    disabled={isProcessing}
                    variant="outline"
                    onClick={handleCustomCheckout}
                  >
                    PAGO PERSONALIZADO
                  </Button>

                  <Button
                    className="w-full !max-w-none hover:bg-transparent text-sm font-medium font-['Lora'] text-neutral-600 hover:text-red-600 transition-colors py-2 uppercase tracking-[3px] disabled:opacity-50"
                    disabled={isProcessing}
                    variant="outline"
                    onClick={clearCart}
                  >
                    VACIAR CARRITO
                  </Button>
                </div>

                {/* Error Message */}
                {mpError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-sm">
                    <p className="text-red-700 text-xs font-['Lora'] tracking-wide">
                      {mpError}
                    </p>
                  </div>
                )}

                {/* Info */}
                <p className="text-xs text-center text-neutral-600 font-['Lora'] tracking-wide leading-relaxed">
                  Los precios incluyen IVA.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;
