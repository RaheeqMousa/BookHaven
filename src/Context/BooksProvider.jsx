import { useMemo, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { UseBooksContext } from "./UseBooksContext";

export function BooksProvider({ children }) {
  const [numberOfBooks] = useState(20);
  const [books, setBooks] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState({
    Categories: [],
    Language: "",
  });
  const [priceRange, setPriceRange] = useState({ Min: "", Max: "" });


  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const fetchBooks = useCallback(
    async (index = 0, apiUrl) => {
      try {
        const url =
          apiUrl ||
          `${BASE_URL}/books/v1/volumes?q=search+terms&startIndex=${index}&maxResults=20&key=${API_KEY}`;

        const res = await axios.get(url);
        console.log(url)
        if (index === 0) {
          setBooks(res.data.items || []);
        } else {
          setBooks((prev) => [...prev, ...(res.data.items || [])]);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [BASE_URL, API_KEY]
  );

  useEffect(() => {
    fetchBooks(0);
  }, [fetchBooks]);


  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const applyPriceFilter = useCallback(() => {
    const min = parseFloat(priceRange.Min) || 0;
    const max = parseFloat(priceRange.Max) || Infinity;

    const filtered = books.filter((book) => {
      const price = book.saleInfo?.retailPrice?.amount;
      if (price === undefined) return false;
      return price >= min && price <= max;
    });

    setBooks(filtered);
  }, [books, priceRange]);


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

        console.log("newFilters", newFilters);

        const defaultQueries = {
          ar: "كتاب",
          en: "book",
          fr: "livre",
        };

        console.log(newFilters.langRestrict)
        let q = defaultQueries[newFilters.Language] || "book";

        if (newFilters.Categories?.length > 0) {
          newFilters.Categories.forEach((c) => {
            q += `+subject:${encodeURIComponent(c)}`;
          });
        }

        let apiUrl = `${BASE_URL}/books/v1/volumes?q=${q}&startIndex=0&maxResults=20&key=${API_KEY}`;

        Object.entries(newFilters).forEach(([key, val]) => {
          if (key === "Language" && val) {
            apiUrl += `&langRestrict=${val}`;
          } else if (Array.isArray(val) && key!="Categories") {
            val.forEach((v) => (apiUrl += `&${key}=${encodeURIComponent(v)}`));
          } else if (val && key!="Categories") {
            apiUrl += `&${key}=${val}`;
          }
        });

        console.log("Final API URL:", apiUrl);

        setStartIndex(0);
        fetchBooks(0, apiUrl);

        return newFilters;
      });
    },
    [BASE_URL, API_KEY, fetchBooks]
  );

  const handleCategoryClick = useCallback(
    (category) => {
      setSelectedFilters((prev) => {
        const prevCategories = prev.Categories || [];
        const categories = prevCategories.includes(category)
          ? prevCategories.filter((c) => c !== category)
          : [...prevCategories, category];

        const defaultQueries = {
          ar: "كتاب",
          en: "book",
          fr: "livre",
        };
        let q = defaultQueries[prev.Language] || "book";

        categories.forEach((c) => {
          q += `+subject:${encodeURIComponent(c)}`;
        });

        let url = `${BASE_URL}/books/v1/volumes?q=${q}&startIndex=0&maxResults=20&key=${API_KEY}`;

        if (prev.Language) {
          url += `&langRestrict=${prev.Language}`;
        }
        setStartIndex(0);
        fetchBooks(0, url);

        return { ...prev, Categories: categories };
      });
    },
    [BASE_URL, API_KEY, fetchBooks]
  );

  const value = useMemo(() => ({
    books,
    fetchBooks,
    startIndex,
    setStartIndex,
    selectedFilters,
    setSelectedFilters,
    handleFilterChange,
    handleCategoryClick,
    numberOfBooks,
    handleInputChange,
    priceRange,
    applyPriceFilter,
    setPriceRange
  }), [books, fetchBooks, handleCategoryClick, handleFilterChange, setSelectedFilters,
    selectedFilters, startIndex, numberOfBooks, handleInputChange, priceRange, applyPriceFilter, setPriceRange]);

  return <UseBooksContext.Provider value={value}>
    {children}
  </UseBooksContext.Provider>;
}

export default BooksProvider