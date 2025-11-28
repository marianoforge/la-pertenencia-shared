import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import DefaultLayout from "@/layouts/default";
import { useWines } from "@/hooks/useWines";
import { Wine, WineFilters } from "@/types/wine";
import WineGridCard from "@/components/wines/WineGridCard";
import WineHero from "@/components/wines/WineHero";
import FilterBar from "@/components/FilterBar";
import FilterPanel from "@/components/FilterPanel";
import { useFilterStore } from "@/stores/useFilterStore";
import Contacto from "@/components/Contacto";
import Combos from "@/components/wines/Combos";

export default function VinosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [localFilters, setLocalFilters] = useState<WineFilters>({
    search: "",
  });
  const router = useRouter();

  
  const {
    filters: storeFilters,
    sortBy,
    isOpen: isFilterPanelOpen,
  } = useFilterStore();

  
  const combinedFilters = useMemo(
    () => ({
      ...storeFilters,
      ...localFilters, 
    }),
    [localFilters, storeFilters],
  );

  const { data: wines = [], isLoading, error } = useWines(combinedFilters);

  
  useEffect(() => {
    if (router.query.search && typeof router.query.search === "string") {
      const urlSearchTerm = router.query.search;

      setSearchTerm(urlSearchTerm);
      setLocalFilters((prev) => ({ ...prev, search: urlSearchTerm }));
    }
  }, [router.query.search]);

  
  useEffect(() => {
    if (isFilterPanelOpen) {
      setSearchTerm("");
      setLocalFilters((prev) => ({ ...prev, search: "" }));

      
      router.push("/vinos", undefined, { shallow: true });
    }
  }, [isFilterPanelOpen, router]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setLocalFilters({ ...localFilters, search: value });

    
    if (value.trim()) {
      router.push(`/vinos?search=${encodeURIComponent(value)}`, undefined, {
        shallow: true,
      });
    } else {
      router.push("/vinos", undefined, { shallow: true });
    }
  };

  
  const featuredWine = useMemo(() => {
    if (!wines.length) return undefined;

    
    return wines.find((wine: Wine) => wine.featured) || wines[0];
  }, [wines]);

  
  const sortedWines = useMemo(() => {
    if (!wines.length) return wines;

    const winesCopy = [...wines];

    switch (sortBy) {
      case "price-asc":
        return winesCopy.sort((a, b) => a.price - b.price);
      case "price-desc":
        return winesCopy.sort((a, b) => b.price - a.price);
      case "name-asc":
        return winesCopy.sort((a, b) => a.marca.localeCompare(b.marca));
      case "name-desc":
        return winesCopy.sort((a, b) => b.marca.localeCompare(a.marca));
      case "newest":
        return winesCopy.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case "relevance":
      default:
        return winesCopy.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;

          return b.price - a.price;
        });
    }
  }, [wines, sortBy]);

  
  const winesPerPage = 12; 
  const totalPages = Math.ceil(sortedWines.length / winesPerPage);

  
  const currentWines = useMemo(() => {
    const startIndex = currentPage * winesPerPage;
    const endIndex = startIndex + winesPerPage;

    return sortedWines.slice(startIndex, endIndex);
  }, [sortedWines, currentPage, winesPerPage]);

  
  useEffect(() => {
    setCurrentPage(0);
  }, [combinedFilters, sortBy]);

  
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  
  const generatePaginationPages = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxPagesToShow = 7; 

    if (totalPages <= maxPagesToShow) {
      
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    
    pages.push(0);

    if (currentPage <= 3) {
      
      for (let i = 1; i <= Math.min(5, totalPages - 2); i++) {
        pages.push(i);
      }
      if (totalPages > 6) {
        pages.push("ellipsis");
      }
      pages.push(totalPages - 1);
    } else if (currentPage >= totalPages - 4) {
      
      pages.push("ellipsis");
      for (let i = totalPages - 6; i < totalPages - 1; i++) {
        if (i > 0) pages.push(i);
      }
      pages.push(totalPages - 1);
    } else {
      
      pages.push("ellipsis");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("ellipsis");
      pages.push(totalPages - 1);
    }

    return pages;
  };

  return (
    <DefaultLayout>
      <div className="w-full mx-auto px-4 md:px-2 lg:px-2 bg-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-[10px] rounded-sm overflow-hidden">
          {}
          <nav
            aria-label="Breadcrumb"
            className="text-black text-sm md:text-base font-normal font-['Lora'] tracking-wide max-[480px]:hidden"
          >
            <ol className="flex items-center space-x-2">
              <li>
                <Link
                  className="hover:text-amber-600 transition-colors"
                  href="/"
                >
                  Inicio
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li aria-current="page" className="text-gray-600">
                Vinos
                {searchTerm && (
                  <span className="text-gray-500 ml-1">
                    - &quot;{searchTerm}&quot;
                  </span>
                )}
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <section className="max-w-[1300px] mx-auto flex flex-col gap-4 md:gap-8 py-4 ">
        {}

        {}
        <div data-aos="fade-up">
          <WineHero featuredWine={featuredWine} />
        </div>

        {}
        <div
          className="w-full max-w-[1300px] mx-auto px-4 md:px-6 lg:px-8"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <FilterBar searchTerm={searchTerm} onSearchChange={handleSearch} />
        </div>

        {}
        <div
          className="w-full max-w-[1300px] mx-auto px-4 md:px-6 lg:px-8"
          data-aos="fade-up"
          data-aos-delay="250"
        >
          <div className="w-full bg-amber-300 py-3 px-6 flex justify-center items-center gap-4 rounded-sm relative">
            {}
            <div className="absolute left-1 flex-shrink-0 w-6 h-6 md:w-8 md:h-8 bg-neutral-900 rounded-full flex items-center justify-center">
              <span className="text-amber-300 text-lg md:text-xl font-bold font-['Lora']">
                !
              </span>
            </div>

            {}
            <p className="text-neutral-900 text-sm md:text-base font-semibold font-['Lora'] uppercase tracking-[3px] md:tracking-[4px] text-center flex-1">
              ¡VENTA MÍNIMA POR CAJA DE 6 UNIDADES!
            </p>

            {}
            <div className="absolute right-1 flex-shrink-0 w-6 h-6 md:w-8 md:h-8 bg-neutral-900 rounded-full flex items-center justify-center">
              <span className="text-amber-300 text-lg md:text-xl font-bold font-['Lora']">
                !
              </span>
            </div>
          </div>
        </div>

        {}
        <div className="w-full max-w-[1300px] mx-auo px-4 md:px-6 lg:px-8">
          {isLoading ? (
            <SkeletonTheme baseColor="#f3f3f3" highlightColor="#e0e0e0">
              <div className="space-y-6">
                {}
                <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <Skeleton height={20} width={200} />
                  <Skeleton height={20} width={150} />
                </div>

                {}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 justify-items-center">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="w-full max-w-[280px]">
                      {}
                      <Skeleton className="rounded-lg mb-4" height={350} />
                      {}
                      <Skeleton className="mb-2" height={24} />
                      {}
                      <Skeleton className="mb-3" height={20} width="80%" />
                      {}
                      <Skeleton className="mb-4" height={28} width="60%" />
                      {}
                      <Skeleton className="rounded" height={40} />
                    </div>
                  ))}
                </div>
              </div>
            </SkeletonTheme>
          ) : error ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-lg font-lora text-red-600">
                Error al cargar los vinos
              </div>
            </div>
          ) : sortedWines.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-lg font-lora">
                {searchTerm || Object.values(combinedFilters).some((f) => f)
                  ? "No se encontraron vinos que coincidan con los filtros seleccionados"
                  : "No se encontraron vinos"}
              </div>
            </div>
          ) : (
            <>
              {}
              <div
                className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <p className="text-sm md:text-base font-normal font-['Lora'] tracking-wide text-gray-600">
                  {sortedWines.length}{" "}
                  {sortedWines.length === 1
                    ? "vino encontrado"
                    : "vinos encontrados"}
                  {searchTerm && (
                    <span className="text-gray-500 ml-1">
                      para &quot;{searchTerm}&quot;
                    </span>
                  )}
                </p>

                {totalPages > 1 && (
                  <p className="text-sm font-normal font-['Lora'] text-gray-500">
                    Página {currentPage + 1} de {totalPages}
                  </p>
                )}
              </div>

              {}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 justify-items-center"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                {currentWines.map((wine: Wine) => (
                  <WineGridCard key={wine.id} wine={wine} />
                ))}
              </div>

              {}
              {totalPages > 1 && (
                <div
                  className="flex justify-center items-center gap-2 sm:gap-4 mt-8 mb-4 px-4"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  {}
                  <button
                    aria-label="Página anterior"
                    className="p-2 sm:px-6 sm:py-2 bg-neutral-900 text-dorado-light rounded-sm font-['Lora'] font-medium uppercase tracking-[2px] text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors flex items-center justify-center min-w-[40px] sm:min-w-auto"
                    disabled={currentPage === 0}
                    onClick={goToPreviousPage}
                  >
                    {}
                    <span className="sm:hidden">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 19l-7-7 7-7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </span>
                    <span className="hidden sm:inline">Anterior</span>
                  </button>

                  {}
                  <div className="flex items-center gap-1 sm:gap-2">
                    {generatePaginationPages().map((page, index) => {
                      if (page === "ellipsis") {
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center text-neutral-600 font-['Lora']"
                          >
                            ...
                          </span>
                        );
                      }

                      return (
                        <button
                          key={page}
                          className={`w-8 sm:w-10 h-8 sm:h-10 rounded-sm font-['Lora'] font-medium text-xs sm:text-sm transition-colors ${
                            currentPage === page
                              ? "bg-amber-300 text-neutral-900"
                              : "bg-white text-neutral-900 border border-neutral-300 hover:bg-neutral-100"
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page + 1}
                        </button>
                      );
                    })}
                  </div>

                  {}
                  <button
                    aria-label="Página siguiente"
                    className="p-2 sm:px-6 sm:py-2 bg-neutral-900 text-dorado-light rounded-sm font-['Lora'] font-medium uppercase tracking-[2px] text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors flex items-center justify-center min-w-[40px] sm:min-w-auto"
                    disabled={currentPage === totalPages - 1}
                    onClick={goToNextPage}
                  >
                    {}
                    <span className="sm:hidden">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 5l7 7-7 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </span>
                    <span className="hidden sm:inline">Siguiente</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Combos subtitle="Combinaciones únicas" title="nuestros combos" />
      <Contacto />
      <FilterPanel />
    </DefaultLayout>
  );
}
