import Style from './FeaturedBooks.module.scss';
import BooksFilter from '../BooksFilter/BooksFilter';
import BookList from '../BooksList/BooksList.jsx';
import { filters } from '../BooksFilter/constants.js';
import { UseBooksContext } from '../../Context/UseBooksContext.jsx';
import { useContext } from 'react';

function FeatureBooks() {
    const {
        books,
        fetchBooks,
        selectedFilters,
        handleFilterChange,
        handleCategoryClick,
        setSelectedFilters
    } = useContext(UseBooksContext);
    console.log(books);

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
                    handleFilterChange={handleFilterChange}
                    setSelectedFilters= {setSelectedFilters}
                />               
                <BookList />
            </section>

            <section className={`row flex-direction-column ${Style['by-category']}`}>
                <h2>Shop by Category</h2>
                <div className={`row ${Style.category}`}>
                    {filters.find(f => f.title === "Categories")?.filterby?.map((c, index) => (
                        <button
                            key={index}
                            className='row justify-content-center'
                            onClick={() => handleCategoryClick(c)}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default FeatureBooks;
