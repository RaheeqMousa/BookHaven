import Style from './FeaturedBooks.module.scss';
import BooksFilter from '../BooksFilter/BooksFilter';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import BookList from '../BooksList/BooksList';
import {filters} from '../BooksFilter/constants.js'

function FeatureBooks() {
    const [numberOfBooks] = useState(20);
    const [startIndex, setStartIndex] = useState(0);
    const [books, setBooks] = useState([]);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;

    const fetchBooks = useCallback(async (index=0, apiUrl) => {
        try {
            let url = apiUrl || `${BASE_URL}/books/v1/volumes?q=search+terms&startIndex=${index}&maxResults=${numberOfBooks}&key=${API_KEY}`;

            const res = await axios.get( url);
            if (index === 0) {
                setBooks(res.data.items || []);
            } else {
                // append new books
                setBooks(prev => [...prev, ...(res.data.items || [])]);
            }
        } catch (e) {
            console.log(e);
        }
    }, [API_KEY, BASE_URL, numberOfBooks]);

    useEffect(() => {
        fetchBooks(0);
    }, [fetchBooks]);

    const [selectedFilters, setSelectedFilters] = useState({
        Categories: [],
        Language: "",
        'Price Range': { min: "", max: "" }
    });

    const handleFilterChange = useCallback((category, value, field) => () => {
        setSelectedFilters((val) => {
            let newFilters;
            const current = val[category];

            if (Array.isArray(current)) {
                newFilters = current.includes(value)
                    ? { ...val, [category]: current.filter(v => v !== value) }
                    : { ...val, [category]: [...current, value] };
            } else if (typeof current === "object" && current !== null) {
                newFilters = { ...val, [category]: { ...current, [field]: value } };
            } else {
                newFilters = { ...val, [category]: value };
            }

            // build api url
            let apiUrl = `${BASE_URL}/books/v1/volumes?q=search+terms&startIndex=0&maxResults=${numberOfBooks}&key=${API_KEY}`;
            Object.entries(newFilters).forEach(([key, val]) => {
                if (key === "Price Range") {
                    if (val.min) apiUrl += `&minPrice=${val.min}`;
                    if (val.max) apiUrl += `&maxPrice=${val.max}`;
                } else if (Array.isArray(val)) {
                    val.forEach(v => apiUrl += `&${key}=${encodeURIComponent(v)}`);
                } else if (val) {
                    apiUrl += `&${key}=${val}`;
                }
            });

            // reset startIndex and books when filter changes
            setStartIndex(0);
            fetchBooks(0, apiUrl);

            return newFilters;
        });
    }, [BASE_URL, API_KEY, numberOfBooks, fetchBooks]);

const handleCategoryClick = (category) => {
    setSelectedFilters(prev => {
        const prevCategories = prev.Categories || [];
        const categories = prevCategories.includes(category)
            ? prevCategories.filter(c => c !== category)
            : [...prevCategories, category];

        // Build Google Books query
        let q = "search+terms";
        categories.forEach(c => {
            q += `+subject:${encodeURIComponent(c)}`;
        });

        const url = `${BASE_URL}/books/v1/volumes?q=${q}&startIndex=0&maxResults=${numberOfBooks}&key=${API_KEY}`;
        console.log(url);

        // Reset index and fetch
        setStartIndex(0);
        fetchBooks(0, url);

        return { ...prev, Categories: categories };
    });
};

    return (
        <div className={`container row flex-direction-column ${Style['feature-books-wrapper']}`}>
            <div className={`row flex-direction-column ${Style['section-intro']}`}>
                <h2>Featured Books</h2>
                <p>Discover popular and trending books from Google Books</p>
            </div>
            <section className={`${Style['featured-section']}`}>
                <BooksFilter 
                    filterChange={fetchBooks} 
                    selectedFilters={selectedFilters} 
                    setSelectedFilters={setSelectedFilters} 
                    handleFilterChange={handleFilterChange} 
                />
                <BookList 
                    books={books} 
                    handleFilterChange={handleFilterChange} 
                    numberOfBooks={numberOfBooks} 
                    setStartIndex={setStartIndex} 
                    startIndex={startIndex} 
                    fetchBooks={fetchBooks}
                />
            </section>
            <section className={`row flex-direction-column ${Style['by-category']}`}>
                <h2>Shop by Category</h2>
                <div className={`row ${Style.category}`}>
        {filters.find(f => f.title === "Categories")?.filterby?.map((c, index) => (
            <button key={index} className='row justify-content-center' onClick={() => handleCategoryClick(c)}>
                {c}
            </button>
        ))}
                </div>
            </section>
        </div>
    );

}
export default FeatureBooks;