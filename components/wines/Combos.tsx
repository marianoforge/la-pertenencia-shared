import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { Section, SectionHeader, ComboCard, Button, NavigationButtons } from "../ui";

import { Wine } from "@/types/wine";
import { Combo } from "@/types/combo";
import { useFeaturedCombos } from "@/hooks/useCombos";
import { useCartStore } from "@/stores/useCartStore";
import { useWindowSize } from "@/hooks/useWindowSize";

interface CombosProps {
  title?: string;
  subtitle?: string;
}

const Recomendados = ({
  title = "recomendados",
  subtitle = "Elegidos con el Corazón",
}: CombosProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { addItem } = useCartStore();
  const router = useRouter();
  const { width } = useWindowSize();

  const isVinosPage = router.pathname.includes("/vinos");

  const { data: featuredCombos = [], isLoading, error } = useFeaturedCombos();

  const displayCombos = featuredCombos;

  const combosPerPage = width < 1024 ? 1 : 2;

  const totalPages = Math.ceil(displayCombos.length / combosPerPage);

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(0);
  }, [combosPerPage]);

  const handleAddComboToCart = (combo: Combo, quantity: number) => {
    const comboAsWine: Wine = {
      id: combo.id,
      marca: combo.name,
      bodega: "Combo",
      tipo: "Combo", // Tipo especial para combos
      varietal: `Combo de ${combo.wines.length} vinos`,
      price: combo.price,
      cost: 0,
      iva: 0,
      stock: 10,
      region: "Argentina",
      vintage: new Date().getFullYear(),
      alcohol: 14,
      image: combo.image,
      featured: combo.featured,
      winery: "La Pertenencia",
      description: `Combo incluye: ${combo.wines.map((wine) => wine.marca).join(", ")}`,
      maridaje: `Combo de ${combo.wines.length} vinos seleccionados`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addItem(comboAsWine, quantity);
  };

  if (isLoading) {
    return (
      <Section className="!px-0 !py-16" id="combos" variant="default">
        <div>
          <SectionHeader subtitle={subtitle} title={title} />
        </div>
        <div className="flex justify-center items-center py-16">
          <div className="text-lg text-gray-600">Cargando combos...</div>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section className="!px-0 !py-16" id="combos" variant="default">
        <div>
          <SectionHeader subtitle={subtitle} title={title} />
        </div>
        <div className="flex justify-center items-center py-16">
          <div className="text-lg text-red-600">Error al cargar combos</div>
        </div>
      </Section>
    );
  }

  if (displayCombos.length === 0) {
    return null;
  }

  return (
    <Section className="!px-0 !py-16" id="combos" variant="default">
      <div>
        <SectionHeader subtitle={subtitle} title={title} />
      </div>

      <div className="w-full max-w-[1300px] max-[480px]:px-0 px-4 sm:px-0 inline-flex flex-col justify-start items-center gap-2.5">
        <div className="pt-5 pb-2.5 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 justify-items-center">
            {displayCombos
              .slice(
                currentPage * combosPerPage,
                currentPage * combosPerPage + combosPerPage
              )
              .map((combo) => (
                <div
                  key={combo.id}
                  className="flex justify-center w-full px-4 sm:px-0"
                >
                  <ComboCard
                    className="w-full sm:w-auto"
                    combo={combo}
                    onAddToCart={handleAddComboToCart}
                  />
                </div>
              ))}
          </div>
        </div>
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 mt-4">
            <NavigationButtons
              currentPage={currentPage}
              totalPages={totalPages}
              onNext={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
              onPrevious={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            />
          </div>
        )}
      </div>

      <footer className="w-full max-w-[1300px] pt-2.5 flex flex-col justify-center items-center gap-7 px-4 sm:px-0 mt-2">
        <p className="text-center text-neutral-900 text-lg font-normal font-['Lora'] italic leading-tight tracking-wide">
          Descubrimos combinaciones únicas que quizás todavía no hayas probado.
          <br />
          Nuestro deseo es simple: que cada combo te sorprenda, te emocione y te
          revele algo distinto.           Todo comienza al abrir una botella.
        </p>
        {!isVinosPage && (
          <>
            <div className="min-[481px]:block hidden">
              <Link href="/vinos#combos">
                <Button size="lg" variant="primary">
                  ver todos
                </Button>
              </Link>
            </div>
            <div className="w-full max-w-[1300px] max-[480px]:px-0 px-4 sm:px-0 max-[480px]:block hidden">
              <Link href="/vinos#combos" className="block">
                <Button className="w-full" size="lg" variant="primary">
                  ver todos
                </Button>
              </Link>
            </div>
          </>
        )}
      </footer>
    </Section>
  );
};

export default Recomendados;
