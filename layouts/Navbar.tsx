import NextLink from "next/link";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import CartButton from "@/components/CartButton";

const experienciasItems = [
  { name: "MEMBRESÍAS", href: "/membresias" },
  { name: "CATAS", href: "/catas" },
  { name: "CREA TU VINO", href: "/crea-tu-vino" },
  // { name: "ESPACIO LA PERTENENCIA", href: "/espacio-la-pertenencia" },
];

const menuItems = [
  { name: "INICIO", href: "/" },
  { name: "VINOS", href: "/vinos" },
  {
    name: "EXPERIENCIAS",
    href: "#",
    hasDropdown: true,
    dropdownItems: experienciasItems,
  },
  // { name: "ACERCA DE NOSOTROS", href: "/about" },
  { name: "CONTACTO", href: "#contacto" },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExperienciasOpen, setIsExperienciasOpen] = useState(false);

  return (
    <div className="w-full bg-stone-900 sticky top-0 z-50">
      <div className="fluid-navbar-padding py-3 flex justify-between items-center">
        {/* Logo */}
        <div
          className="relative"
          style={{ width: "clamp(8rem, 12vw, 10rem)", height: "0.875rem" }}
        >
          <NextLink className="flex items-center w-full h-full" href="/">
            <Image
              fill
              priority
              alt="La Pertenencia Logo"
              className="object-contain"
              sizes="(max-width: 768px) 8rem, (max-width: 1200px) 10vw, 10rem"
              src="/images/logo-txt.svg"
            />
          </NextLink>
        </div>

        {/* Right side - Desktop Menu + Icons */}
        <div
          className="flex justify-start items-center"
          style={{ gap: "clamp(1rem, 2vw, 1.5rem)" }}
        >
          {/* Desktop Menu - Fluid visibility */}
          <div className="fluid-menu-hide justify-start items-center fluid-gap">
            {menuItems.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsExperienciasOpen(true)}
                    onMouseLeave={() => setIsExperienciasOpen(false)}
                  >
                    <button
                      className="text-white font-normal font-['Lora'] hover:text-dorado-light transition-colors whitespace-nowrap flex items-center"
                      style={{
                        fontSize: "clamp(0.625rem, 0.8vw, 0.75rem)",
                        letterSpacing: "clamp(0.15rem, 0.3vw, 0.25rem)",
                      }}
                    >
                      {item.name}
                      <motion.svg
                        animate={{ rotate: isExperienciasOpen ? 180 : 0 }}
                        className="w-4 h-4 ml-1"
                        fill="currentColor"
                        transition={{ duration: 0.2 }}
                        viewBox="0 0 20 20"
                      >
                        <path
                          clipRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          fillRule="evenodd"
                        />
                      </motion.svg>
                    </button>

                    <AnimatePresence>
                      {isExperienciasOpen && (
                        <motion.div
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full left-0 mt-2 bg-stone-800 rounded-md shadow-lg border border-stone-700 min-w-[200px] z-50"
                          exit={{ opacity: 0, y: -10 }}
                          initial={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.dropdownItems?.map((dropdownItem) => (
                            <NextLink
                              key={dropdownItem.name}
                              className="block px-4 py-3 text-white text-sm font-normal font-['Lora'] hover:bg-stone-700 hover:text-dorado-light transition-colors first:rounded-t-md last:rounded-b-md"
                              href={dropdownItem.href}
                              style={{
                                letterSpacing: "0.1rem",
                              }}
                            >
                              {dropdownItem.name}
                            </NextLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <NextLink
                    className="text-white font-normal font-['Lora'] hover:text-dorado-light transition-colors whitespace-nowrap flex items-center"
                    href={item.href}
                    style={{
                      fontSize: "clamp(0.625rem, 0.8vw, 0.75rem)",
                      letterSpacing: "clamp(0.15rem, 0.3vw, 0.25rem)",
                    }}
                  >
                    {item.name}
                  </NextLink>
                )}
              </div>
            ))}
          </div>

          {/* Vertical separator - Desktop only */}
          <div className="fluid-menu-hide w-5 h-0 rotate-90 outline outline-[0.5px] outline-offset-[-0.41px] outline-white" />

          {/* Icons */}
          <div className="flex justify-start items-center gap-4">
            {/* Cart Icon */}
            <CartButton />

            {/* Vertical separator - Mobile only */}
            <div className="fluid-menu-show w-5 h-0 rotate-90 outline outline-[0.81px] outline-offset-[-0.41px] outline-white" />

            {/* Menu hamburger - Mobile only */}
            <motion.button
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="fluid-menu-show w-6 h-6 hover:opacity-75 transition-opacity"
              transition={{ duration: 0.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Image
                  alt="Menu"
                  className="object-contain"
                  height={24}
                  src="/icons/majesticons_menu.svg"
                  width={24}
                />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Only visible on smaller screens */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="absolute top-full left-0 right-0 bg-stone-900 border-t border-stone-700 lg:hidden z-40 overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
              opacity: { duration: 0.2 },
            }}
          >
            <motion.div
              animate={{ y: 0 }}
              className="flex flex-col py-4"
              exit={{ y: -20 }}
              initial={{ y: -20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  initial={{ opacity: 0, x: -20 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {item.hasDropdown ? (
                    <>
                      <button
                        className="w-full text-left px-4 py-3 text-white text-sm font-normal font-['Lora'] tracking-[2px] hover:bg-stone-800 hover:text-dorado-light transition-colors flex items-center justify-between"
                        onClick={() =>
                          setIsExperienciasOpen(!isExperienciasOpen)
                        }
                      >
                        {item.name}
                        <motion.svg
                          animate={{ rotate: isExperienciasOpen ? 180 : 0 }}
                          className="w-5 h-5"
                          fill="currentColor"
                          transition={{ duration: 0.2 }}
                          viewBox="0 0 20 20"
                        >
                          <path
                            clipRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            fillRule="evenodd"
                          />
                        </motion.svg>
                      </button>
                      <AnimatePresence>
                        {isExperienciasOpen && (
                          <motion.div
                            animate={{ height: "auto", opacity: 1 }}
                            className="bg-stone-800 overflow-hidden"
                            exit={{ height: 0, opacity: 0 }}
                            initial={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.dropdownItems?.map(
                              (dropdownItem, dropdownIndex) => (
                                <motion.div
                                  key={dropdownItem.name}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  initial={{ opacity: 0, x: -10 }}
                                  transition={{
                                    duration: 0.2,
                                    delay: dropdownIndex * 0.03,
                                  }}
                                >
                                  <NextLink
                                    className="block px-8 py-2 text-white text-xs font-normal font-['Lora'] tracking-[1px] hover:bg-stone-700 hover:text-dorado-light transition-colors"
                                    href={dropdownItem.href}
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    {dropdownItem.name}
                                  </NextLink>
                                </motion.div>
                              )
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <NextLink
                      className="block px-4 py-3 text-white text-sm font-normal font-['Lora'] tracking-[2px] hover:bg-stone-800 hover:text-dorado-light transition-colors"
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </NextLink>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
