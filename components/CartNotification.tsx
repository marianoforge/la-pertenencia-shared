import { useCartStore } from "@/stores/useCartStore";

const CartNotification = () => {
  const { showNotification, notificationMessage, hideNotification } =
    useCartStore();

  if (!showNotification) return null;

  return (
    <div className="fixed top-20 right-4 z-[9999] bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium font-lora">
          {notificationMessage}
        </span>
        <button
          aria-label="Cerrar notificación"
          className="text-white hover:text-gray-200 ml-2"
          onClick={hideNotification}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CartNotification;
