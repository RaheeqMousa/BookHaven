import BookCard from "../../Components/BookCard/BookCard";
import Style from './BooksList.module.scss';
import { IoIosList } from "react-icons/io";
import { MdGridOn } from "react-icons/md";
import { useCallback, useContext, useState } from "react";
import { UseBooksContextData } from "../../Context/UseBooksContextData.jsx";
import { UseBooksContext } from "../../Context/UseBooksContext.jsx";
import { FixedSizeList } from "react-window";

function BookList() {
    const { books = [], numberOfBooks = 20, startIndex, setStartIndex, fetchBooks } = useContext(UseBooksContextData);
    const { handleFilterChange } = useContext(UseBooksContext);


    const [isGridDisplay, setGridDisplay] = useState(true);
    const toggleDisplay = useCallback(
        () => setGridDisplay(prev => !prev), []
    );

    const loadMore = () => {
        const newIndex = startIndex + numberOfBooks;
        setStartIndex(newIndex);
        fetchBooks(newIndex);
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
            <FixedSizeList
                height={600}
                width={'100%'}
                itemCount={Math.ceil(books.length / 4)}
                itemSize={isGridDisplay ? 540 : 260}
            >
                {({ index, style }) => {
                    const startIndex = isGridDisplay ? index * 4 : index;
                    const rowBooks = isGridDisplay ? books.slice(startIndex, startIndex + 4) : [books[startIndex]];

                    return (
                        <div
                            style={{
                                ...style,
                                display: 'flex',
                                gap: '16px',
                                padding: '8px',
                            }}
                        >
                            {rowBooks.map((book) => {
                                
                                return(<div
                                    key={book.id}
                                    style={{
                                        width: isGridDisplay ? '210px' : '97%',
                                    }}
                                    className="row justify-content-center"
                                >
                                    <BookCard
                                        book={book}
                                        isGridDisplay={isGridDisplay}
                                    />
                                </div>);
                            })}
                        </div>
                    );
                }}
            </FixedSizeList>

            <button onClick={loadMore} className={Style['load-more']}>
                Load More Books
            </button>
        </section>
    );
}


export default BookList;
