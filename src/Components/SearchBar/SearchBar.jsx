import SearchImg from '../../assets/Images/search.svg';
import Style from './SearchBar.module.scss';
import { useContext} from "react";
import { UseBooksContext } from '../../Context/UseBooksContext.jsx';
import useBookSearch from '../../Hooks/useSearchBook.jsx';

function SearchBar() {

  const { fetchBooks } = useContext(UseBooksContext);
  const {
    query,
    suggestions,
    handleChange,

    handleKeyDown,
    handleSuggestionClick
    } = useBookSearch(fetchBooks);


  return (
    <div className={`row ${Style['search-field']}`}>
      <img src={SearchImg} height={16} width={16} alt="search" />
      <input
        type="text"
        placeholder="Search for books, authors, genres"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      {query.trim() && suggestions.length > 0 && (
        <ul className={`suggestions`}>
          {suggestions.map(function(s, i) {
            return (
              <li key={i} onClick={handleSuggestionClick(s)}>
                {s}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
