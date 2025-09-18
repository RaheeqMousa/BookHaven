import {useMemo, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { UseBooksContext } from "./UseBooksContext";

export function BooksProvider({ children }) {
  const [numberOfBooks] = useState(20);
  const [books, setBooks] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState({
    Categories: [],
    Language: "",
    "Price Range": { min: "", max: "" },
  });

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

        let apiUrl = `${BASE_URL}/books/v1/volumes?q=search+terms&startIndex=0&maxResults=20&key=${API_KEY}`;
        Object.entries(newFilters).forEach(([key, val]) => {
          if (key === "Price Range") {
            if (val.min) apiUrl += `&minPrice=${val.min}`;
            if (val.max) apiUrl += `&maxPrice=${val.max}`;
          } else if (Array.isArray(val)) {
            val.forEach((v) => (apiUrl += `&${key}=${encodeURIComponent(v)}`));
          } else if (val) {
            apiUrl += `&${key}=${val}`;
          }
        });

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

        let q = "search+terms";
        categories.forEach((c) => {
          q += `+subject:${encodeURIComponent(c)}`;
        });

        const url = `${BASE_URL}/books/v1/volumes?q=${q}&startIndex=0&maxResults=20&key=${API_KEY}`;

        setStartIndex(0);
        fetchBooks(0, url);

        return { ...prev, Categories: categories };
      });
    },
    [BASE_URL, API_KEY, fetchBooks]
  );

  const value =useMemo(()=> ({
    books,
    fetchBooks,
    startIndex,
    setStartIndex,
    selectedFilters,
    setSelectedFilters,
    handleFilterChange,
    handleCategoryClick,
    numberOfBooks
  }),[books,fetchBooks,handleCategoryClick,handleFilterChange,setSelectedFilters,selectedFilters,startIndex,numberOfBooks]);

  return <UseBooksContext.Provider value={value}>
            {children}
        </UseBooksContext.Provider>;
}

export default BooksProvider