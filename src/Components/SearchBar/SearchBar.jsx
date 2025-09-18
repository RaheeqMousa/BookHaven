import SearchImg from '../../assets/Images/search.svg'
import Style from './SearchBar.module.scss'
import { useContext, useState,useEffect } from "react";
import { UseBooksContext } from '../../Context/UseBooksContext.jsx';

function SearchBar(){

    const [query, setQuery] = useState("");
    const { fetchBooks, setStartIndex } = useContext(UseBooksContext);

    useEffect(() => {
        console.log(query)
        if (!query.trim()) return;

        const timer = setTimeout(() => {
            setStartIndex(0);
            const url = `${import.meta.env.VITE_API_BASE_URL}/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=0&maxResults=20&key=${import.meta.env.VITE_API_KEY}`;
            fetchBooks(0, url);
        }, 500);

        return () => clearTimeout(timer);
    }, [query, fetchBooks, setStartIndex]);

    return (
        <div className={`row ${Style['search-field']}`}>
            <img src={SearchImg} height={16} width={16} />
            <input
                type="text"
                placeholder="Search for books, authors, genres"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
    )
}
export default SearchBar;
