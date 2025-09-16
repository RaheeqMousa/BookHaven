import PropTypes from "prop-types";
import BookCard from "../BookCard/BookCard";

function BookList(props) {
    const { books } = props;

    return (
        <section>
            <div>

            </div>
            <div>
                {
                    books.map((book)=>{
                        <BookCard book={book} />
                    })
                }
            </div>
        </section>
    );
}

BookList.PropTypes = {

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
    )

};

export default BookList;