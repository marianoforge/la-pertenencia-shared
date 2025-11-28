import { ShippingInfo } from "@/types/cart";

interface ShippingFormProps {
  shippingInfo: ShippingInfo;
  postalCode: string;
  onShippingInfoChange: (info: Partial<ShippingInfo>) => void;
  onPostalCodeChange: (code: string) => void;
  onCalculateShipping: () => void;
}

export const ShippingForm: React.FC<ShippingFormProps> = ({
  shippingInfo,
  postalCode,
  onShippingInfoChange,
  onPostalCodeChange,
  onCalculateShipping,
}) => {
  return (
    <div className="mt-6 pt-6 border-t border-neutral-200">
      <h3 className="text-sm font-semibold font-['Lora'] text-neutral-900 mb-3 uppercase tracking-[1px]">
        Información de envío:
      </h3>
      <div className="space-y-3">
        <div>
          <label
            className="block text-xs font-medium font-['Lora'] text-neutral-700 mb-1 tracking-wide"
            htmlFor="address"
          >
            Dirección *
          </label>
          <input
            required
            className="w-full px-4 py-2 border border-neutral-300 rounded-sm font-['Lora'] text-sm focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:border-transparent"
            id="address"
            placeholder="Calle, número, piso, depto., localidad"
            type="text"
            value={shippingInfo.address}
            onChange={(e) => onShippingInfoChange({ address: e.target.value })}
          />
        </div>
        
        <div>
          <label
            className="block text-xs font-medium font-['Lora'] text-neutral-700 mb-1 tracking-wide"
            htmlFor="phone"
          >
            Número de teléfono *
          </label>
          <input
            required
            className="w-full px-4 py-2 border border-neutral-300 rounded-sm font-['Lora'] text-sm focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:border-transparent"
            id="phone"
            placeholder="+54 9 11 XXXX-XXXX"
            type="tel"
            value={shippingInfo.phone}
            onChange={(e) => onShippingInfoChange({ phone: e.target.value })}
          />
        </div>
        
        <div>
          <label
            className="block text-xs font-medium font-['Lora'] text-neutral-700 mb-1 tracking-wide"
            htmlFor="postalCode"
          >
            Código Postal *
          </label>
          <div className="flex gap-2">
            <input
              required
              className="w-1/2 px-4 py-2 border border-neutral-300 rounded-sm font-['Lora'] text-sm focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:border-transparent"
              id="postalCode"
              placeholder="Código Postal"
              type="text"
              value={postalCode}
              onChange={(e) => onPostalCodeChange(e.target.value)}
            />
            <button
              className="flex-1 px-4 py-2 bg-neutral-900 text-dorado-light font-['Lora'] text-xs font-semibold uppercase tracking-[1px] rounded-sm hover:bg-neutral-800 transition-colors"
              onClick={onCalculateShipping}
            >
              Calcular envío
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

