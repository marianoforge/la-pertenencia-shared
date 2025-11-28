export const EmptyCart = () => {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
        <svg
          fill="none"
          height="32"
          viewBox="0 0 24 24"
          width="32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z"
            stroke="#737373"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold font-['Lora'] text-neutral-900 mb-2 uppercase tracking-[2px]">
        Tu carrito está vacío
      </h3>
      <p className="text-neutral-600 font-['Lora'] tracking-wide">
        Agrega algunos vinos para comenzar
      </p>
    </div>
  );
};

