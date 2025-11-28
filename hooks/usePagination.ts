import { useState, useEffect, useMemo } from "react";

interface UsePaginationOptions<T> {
  items: T[];
  itemsPerPage?: number;
  searchTerm?: string;
  searchFields?: (keyof T)[];
}

export function usePagination<T extends Record<string, any>>({
  items,
  itemsPerPage = 10,
  searchTerm = "",
  searchFields = [],
}: UsePaginationOptions<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = useMemo(() => {
    if (!searchTerm || searchFields.length === 0) return items;

    const searchLower = searchTerm.toLowerCase();

    return items.filter((item) => {
      return searchFields.some((field) => {
        const value = item[field];
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchLower);
        }
        if (typeof value === "number") {
          return value.toString().includes(searchLower);
        }
        if (Array.isArray(value)) {
          return value.some((v) =>
            typeof v === "string" ? v.toLowerCase().includes(searchLower) : false
          );
        }
        return false;
      });
    });
  }, [items, searchTerm, searchFields]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage, searchTerm]);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    filteredItems,
    totalItems: filteredItems.length,
    setCurrentPage,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
    goToNextPage: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)),
    goToPreviousPage: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
  };
}

