import PropTypes from "prop-types";
import BookCard from "../../Components/BookCard/BookCard";
import Style from './BooksList.module.scss';
import { IoIosList } from "react-icons/io";
import { MdGridOn } from "react-icons/md";
import { useCallback, useContext, useState } from "react";
import { UseBooksContext } from '../../Context/UseBooksContext.jsx';

function BookList() {
    const { books = [], handleFilterChange, numberOfBooks, startIndex, setStartIndex,fetchBooks } = useContext(UseBooksContext);
    const [isGridDisplay, setGridDisplay] = useState(true);
    const toggleDisplay = useCallback(
        () => setGridDisplay(prev => !prev), []
    );

    const loadMore = () => {
        const newIndex = startIndex + numberOfBooks;
        setStartIndex(newIndex);
        fetchBooks(newIndex);
    };
    console.log(books);
    
    return (
        <section className={`row flex-direction-column ${Style['books-list']}`}>
            <div className={`row ${Style['list-options']}`}>
                <p>Showing {books.length} books</p>
                <div className={`row ${Style['list-filters']}`}>
                    <select onChange={e => handleFilterChange('orderBy', e.target.value)()}>
                        <option value="relevance">Most Relevant</option>
                        <option value="newest">Newest</option>
                    </select>
                    <div onClick={toggleDisplay} className={`row ${Style['toggle-display']}`}>
                        <div className={`row justify-content-center ${isGridDisplay ? Style.selected : ''}`}>
                            <button aria-label="Grid Cards view button">
                                <MdGridOn width={16} height={16} color="white" />
                            </button>
                        </div>
                        <div className={`row justify-content-center ${isGridDisplay ? '' : Style.selected}`}>
                            <button aria-label="List Cards view button">
                                <IoIosList width={16} height={16} color={`${isGridDisplay ? 'black' : 'white'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`row ${Style.cards}`}>
                {books.map((book) => (
                    <BookCard book={book} isGridDisplay={isGridDisplay} key={`BookList-Book-${book.id}`} />
                ))}
            </div>
            <button onClick={loadMore} className={Style['load-more']}>
                Load More Books
            </button>
        </section>
    );
}


export default BookList;
