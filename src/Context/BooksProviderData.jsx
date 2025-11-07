import {useState, useCallback, useEffect, useMemo } from "react";
import axios from "axios";
import { UseBooksContextData } from "./UseBooksContextData";

export function BooksProviderData({ children }) {

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const fetchBooks = useCallback(
    async (index = 0, apiUrl) => {
      setLoading(true);
      try {
        const url =
          apiUrl ||
          `${BASE_URL}/books/v1/volumes?q=search+terms&startIndex=${index}&maxResults=20&key=${API_KEY}`;
        const res = await axios.get(url);

        setBooks((prev) => (index === 0 ? res.data.items || [] : [...prev, ...(res.data.items || [])]));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [BASE_URL, API_KEY]
  );

  useEffect(() => {
    fetchBooks(0);
  }, [fetchBooks]);

  const value = useMemo(
    () => ({ books, loading, fetchBooks, startIndex, setStartIndex }),
    [books, loading, fetchBooks, startIndex]
  );

  

  return <UseBooksContextData.Provider value={value}>
    {children}
  </UseBooksContextData.Provider>;
}
