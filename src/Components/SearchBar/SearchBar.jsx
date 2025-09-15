import SearchImg from '../../assets/Images/search.svg'
import Style from './SearchBar.module.scss'

function SearchBar(){

    return (
        <label className={`row ${Style['search-field']}`}>
            <img src={SearchImg} height={16} width={16} />
            <input  placeholder='Search for books, authors, genres' />
        </label>
    )
}
export default SearchBar;