import Style from './FeaturedBooks.module.scss'
import BooksFilter from '../BooksFilter/BooksFilter';
function FeatureBooks() {

    const filterChange = (apiUrl) => {
        console.log(apiUrl);
    }
    return (
        <div className={` container row flex-direction-column ${Style['feature-books-wrapper']}`}>
            <div className={`row flex-direction-column ${Style['section-intro']}`}>
                <h2>Featured Books</h2>
                <p>Discover popular and trending books from Google Books</p>
            </div>
            <section className={`${Style['featured-section']}`}>
                <BooksFilter filterChange={filterChange} />

                <section>

                </section>
            </section>
        </div>
    );

}
export default FeatureBooks;