import { useState, useEffect, useCallback } from "react";
import useSearchHistory from "./useSearchHistory";

export default function useBookSearch(fetchBooks) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [history, setHistory] = useSearchHistory();
    const [hideSuggestions, setHideSuggestions] = useState(true);

    useEffect(() => {
        if (hideSuggestions) return;

        if (!query.trim()) {
            setSuggestions(history);
            setHideSuggestions(true);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const url = `${import.meta.env.VITE_API_BASE_URL}/books/v1/volumes?q=${encodeURIComponent(
                    query
                )}&maxResults=5&key=${import.meta.env.VITE_API_KEY}`;

                const res = await fetch(url);
                const data = await res.json();

                const apiSuggestions =
                    data.items?.map(item => item.volumeInfo.title) || [];

                const merged = [
                    ...new Set([
                        ...apiSuggestions,
                        ...history.filter(h =>
                            h.toLowerCase().startsWith(query.toLowerCase())
                        )
                    ])
                ];

                setSuggestions(merged.slice(0, 5));
            } catch (err) {
                console.error("Suggestion fetch failed:", err);
                setSuggestions(history);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, history, hideSuggestions]);


    const handleChange = useCallback((e) => {
        setQuery(e.target.value);
        setHideSuggestions(false);
    }, []);


    const handleSearch = useCallback((searchQuery) => {
        if (!searchQuery.trim()) return;

        setQuery(searchQuery);

        const url = `${import.meta.env.VITE_API_BASE_URL}/books/v1/volumes?q=${encodeURIComponent(
            searchQuery
        )}&startIndex=0&maxResults=20&key=${import.meta.env.VITE_API_KEY}`;
        fetchBooks(0, url);

        const updated = [searchQuery, ...history.filter(h => h !== searchQuery)].slice(0, 10);
        setHistory(updated);

        setSuggestions([]);
        setHideSuggestions(true);
    }, [fetchBooks, history, setHistory]);


    const handleSuggestionClick = useCallback((suggestion) =>
        () => {

            handleSearch(suggestion);
        }, [handleSearch]);


    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter") {
            handleSearch(query);
        }
    }, [handleSearch, query])

    return {
        query,
        suggestions,
        handleChange,
        handleSearch,
        hideSuggestions,
        setHideSuggestions,
        handleKeyDown,
        handleSuggestionClick
    };
}
