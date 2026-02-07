import { useState, useCallback, useMemo } from "react";
import { useContext } from "react";
import { UseBooksContextData } from "./UseBooksContextData";
import { UseBooksContext } from "./UseBooksContext";

export function BooksProvider({ children }) {
  const { fetchBooks, setStartIndex, books } = useContext(UseBooksContextData);

  const [selectedFilters, setSelectedFilters] = useState({ Categories: [], Language: "" });
  const [priceRange, setPriceRange] = useState({ Min: "", Max: "" });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({ ...prev, [name]: value }));
  }, []);

  const applyPriceFilter = useMemo(() => {
    const min = parseFloat(priceRange.Min) || 0;
    const max = parseFloat(priceRange.Max) || Infinity;

    return books.filter((book) => {
      const price = book.saleInfo?.retailPrice?.amount;
      return price === undefined || (price >= min && price <= max);
    });
  }, [books, priceRange]);

  const buildBooksUrl = useCallback((filters, startIndex = 0) => {
    const defaultQueries = { ar: "كتاب", en: "book", fr: "livre" };
    let q = defaultQueries[filters.Language] || "book";

    if (filters.Categories?.length > 0) {
      filters.Categories.forEach((c) => (q += `+subject:${encodeURIComponent(c)}`));
    }

    let apiUrl = `${import.meta.env.VITE_API_BASE_URL}/books/v1/volumes?q=${q}&startIndex=${startIndex}&maxResults=20&key=${import.meta.env.VITE_API_KEY}`;

    Object.entries(filters).forEach(([key, val]) => {
      if (key === "Language" && val)
        apiUrl += `&langRestrict=${val}`;
      else if (Array.isArray(val) && key !== "Categories")
        val.forEach((v) => (apiUrl += `&${key}=${encodeURIComponent(v)}`));
      else if (val && key !== "Categories")
        apiUrl += `&${key}=${val}`;
    });

    return apiUrl;
  }, []);

  const handleFilterChange = useCallback(
    (category, value, field) => () => {
      setSelectedFilters((prev) => {
        let newFilters;
        const current = prev[category];

        if (Array.isArray(current)) {
          newFilters = current.includes(value)
            ? { ...prev, [category]: current.filter((v) => v !== value) }
            : { ...prev, [category]: [...current, value] };
        } else if (typeof current === "object" && current !== null) {
          newFilters = { ...prev, [category]: { ...current, [field]: value } };
        } else {
          newFilters = { ...prev, [category]: value };
        }

        const apiUrl = buildBooksUrl(newFilters, 0);
        setStartIndex(0);
        fetchBooks(0, apiUrl);

        return newFilters;
      });
    },
    [fetchBooks, setStartIndex, buildBooksUrl]
  );

  const handleCategoryClick = useCallback(
    (category) => {
      setSelectedFilters((prev) => {
        const prevCategories = prev.Categories || [];
        const categories = prevCategories.includes(category)
          ? prevCategories.filter((c) => c !== category)
          : [...prevCategories, category];

        const newFilters = { ...prev, Categories: categories };
        const apiUrl = buildBooksUrl(newFilters, 0);
        setStartIndex(0);
        fetchBooks(0, apiUrl);

        return { ...prev, Categories: categories };
      });
    },
    [fetchBooks, setStartIndex, buildBooksUrl]
  );

  const value = useMemo(
    () => ({
      selectedFilters,
      setSelectedFilters,
      priceRange,
      setPriceRange,
      handleInputChange,
      applyPriceFilter,
      handleFilterChange,
      handleCategoryClick,
    }),
    [selectedFilters, priceRange, handleInputChange, applyPriceFilter, handleFilterChange, handleCategoryClick]
  );

  return <UseBooksContext.Provider value={value}>
    {children}
  </UseBooksContext.Provider>;
}

export default BooksProvider;
