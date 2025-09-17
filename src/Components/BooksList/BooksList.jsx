import PropTypes from "prop-types";
import BookCard from "../../Components/BookCard/BookCard";
import Style from './BooksList.module.scss';
import { IoIosList } from "react-icons/io";
import { MdGridOn } from "react-icons/md";
import { useCallback, useState } from "react";

function BookList(props) {
    const { books = [], handleFilterChange, numberOfBooks, startIndex, setStartIndex,fetchBooks } = props;
    const [isGridDisplay, setGridDisplay] = useState(true);
    const toggleDisplay = useCallback(
        () => setGridDisplay(prev => !prev), []
    );

    const loadMore = () => {
        const newIndex = startIndex + numberOfBooks;
        setStartIndex(newIndex);
        fetchBooks(newIndex); // fetch next page
    };

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
                            <button>
                                <MdGridOn width={16} height={16} color="white" />
                            </button>
                        </div>
                        <div className={`row justify-content-center ${isGridDisplay ? '' : Style.selected}`}>
                            <button>
                                <IoIosList width={16} height={16} color={`${isGridDisplay ? 'black' : 'white'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`row ${Style.cards}`}>
                {books.map((book, index) => (
                    <BookCard book={book} isGridDisplay={isGridDisplay} key={index} />
                ))}
            </div>
            <button onClick={loadMore} className={Style['load-more']}>
                Load More Books
            </button>
        </section>
    );
}

BookList.propTypes = {
    books: PropTypes.arrayOf(
        PropTypes.shape({
            imageLink: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            printType: PropTypes.string.isRequired,
            info: PropTypes.string.isRequired,
            category: PropTypes.string.isRequired,
            saleability: PropTypes.string.isRequired,
            pageCount: PropTypes.number.isRequired,
        })
    ),
    handleFilterChange: PropTypes.func.isRequired,
    numberOfBooks: PropTypes.number.isRequired,
    startIndex: PropTypes.number.isRequired,
    setStartIndex: PropTypes.func.isRequired,
    fetchBooks: PropTypes.func.isRequired
};

export default BookList;
