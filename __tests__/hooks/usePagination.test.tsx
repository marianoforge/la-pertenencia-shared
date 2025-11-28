import { renderHook, act } from "@testing-library/react";
import { usePagination } from "@/hooks/usePagination";

interface TestItem {
  id: string;
  name: string;
  category: string;
}

const mockItems: TestItem[] = [
  { id: "1", name: "Item 1", category: "A" },
  { id: "2", name: "Item 2", category: "B" },
  { id: "3", name: "Item 3", category: "A" },
  { id: "4", name: "Item 4", category: "C" },
  { id: "5", name: "Item 5", category: "B" },
];

describe("usePagination", () => {
  it("should initialize with first page", () => {
    const { result } = renderHook(() =>
      usePagination({ items: mockItems, itemsPerPage: 2 }),
    );

    expect(result.current.currentPage).toBe(1);
    expect(result.current.paginatedItems).toHaveLength(2);
    expect(result.current.totalPages).toBe(3);
  });

  it("should paginate items correctly", () => {
    const { result } = renderHook(() =>
      usePagination({ items: mockItems, itemsPerPage: 2 }),
    );

    expect(result.current.paginatedItems).toEqual([
      { id: "1", name: "Item 1", category: "A" },
      { id: "2", name: "Item 2", category: "B" },
    ]);

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.paginatedItems).toEqual([
      { id: "3", name: "Item 3", category: "A" },
      { id: "4", name: "Item 4", category: "C" },
    ]);
  });

  it("should filter items by search term", () => {
    const { result } = renderHook(() =>
      usePagination({
        items: mockItems,
        itemsPerPage: 10,
        searchTerm: "Item 1",
        searchFields: ["name"],
      }),
    );

    expect(result.current.filteredItems).toHaveLength(1);
    expect(result.current.filteredItems[0].name).toBe("Item 1");
  });

  it("should filter items by multiple search fields", () => {
    const { result } = renderHook(() =>
      usePagination({
        items: mockItems,
        itemsPerPage: 10,
        searchTerm: "A",
        searchFields: ["category"],
      }),
    );

    expect(result.current.filteredItems).toHaveLength(2);
    expect(result.current.filteredItems.every((item) => item.category === "A")).toBe(true);
  });

  it("should reset to first page when search term changes", () => {
    const { result, rerender } = renderHook(
      ({ searchTerm }) =>
        usePagination({
          items: mockItems,
          itemsPerPage: 2,
          searchTerm,
          searchFields: ["name"],
        }),
      { initialProps: { searchTerm: "" } },
    );

    act(() => {
      result.current.setCurrentPage(2);
    });

    expect(result.current.currentPage).toBe(2);

    rerender({ searchTerm: "Item 1" });

    expect(result.current.currentPage).toBe(1);
  });

  it("should calculate hasNext and hasPrevious correctly", () => {
    const { result } = renderHook(() =>
      usePagination({ items: mockItems, itemsPerPage: 2 }),
    );

    expect(result.current.hasNext).toBe(true);
    expect(result.current.hasPrevious).toBe(false);

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.hasNext).toBe(true);
    expect(result.current.hasPrevious).toBe(true);

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.hasNext).toBe(false);
    expect(result.current.hasPrevious).toBe(true);
  });

  it("should not go beyond first page", () => {
    const { result } = renderHook(() =>
      usePagination({ items: mockItems, itemsPerPage: 2 }),
    );

    act(() => {
      result.current.goToPreviousPage();
    });

    expect(result.current.currentPage).toBe(1);
  });

  it("should not go beyond last page", () => {
    const { result } = renderHook(() =>
      usePagination({ items: mockItems, itemsPerPage: 2 }),
    );

    act(() => {
      result.current.setCurrentPage(10);
    });

    expect(result.current.currentPage).toBeLessThanOrEqual(
      result.current.totalPages,
    );
  });

  it("should handle empty items array", () => {
    const { result } = renderHook(() =>
      usePagination({ items: [], itemsPerPage: 10 }),
    );

    expect(result.current.paginatedItems).toHaveLength(0);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.hasNext).toBe(false);
    expect(result.current.hasPrevious).toBe(false);
  });

  it("should handle search with number fields", () => {
    const itemsWithNumbers = [
      { id: "1", name: "Item 1", price: 100 },
      { id: "2", name: "Item 2", price: 200 },
    ];

    const { result } = renderHook(() =>
      usePagination({
        items: itemsWithNumbers,
        itemsPerPage: 10,
        searchTerm: "100",
        searchFields: ["price"],
      }),
    );

    expect(result.current.filteredItems).toHaveLength(1);
  });

  it("should handle search with array fields", () => {
    const itemsWithArrays = [
      { id: "1", name: "Item 1", tags: ["tag1", "tag2"] },
      { id: "2", name: "Item 2", tags: ["tag3"] },
    ];

    const { result } = renderHook(() =>
      usePagination({
        items: itemsWithArrays,
        itemsPerPage: 10,
        searchTerm: "tag1",
        searchFields: ["tags"],
      }),
    );

    expect(result.current.filteredItems).toHaveLength(1);
  });
});

