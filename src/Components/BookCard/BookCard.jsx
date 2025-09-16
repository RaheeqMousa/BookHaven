import PropTypes from 'prop-types';
import Style from './BookCard.module.scss'
function BookCard(props){
    const {book} = props;

    return (
        <div className={Style['book-card']}>
            <div className={Style['book-cover']}>
                <img 
                    src={book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail} 
                    alt={book.title} 
                    title={book.title}  width={168} height={180}
                />
                <p>{book.printType}</p>
            </div>
            <div className={Style.info}>
                <p className={Style.category}>{book.categories[0]}</p>
                <h3>{book.title}</h3>
                <p className="book-subtitle">{book.subtitle || `by ${book.authors?.join(', ')}`}</p>
                <p className="book-availability">
                <span><strong>{book.saleability}</strong> {book.pageCount ? `${book.pageCount} pages` : ''}</span>
                </p>
            </div>

        </div >
    );
}

BookCard.PropTypes={
    book:PropTypes.shape({
        imageLink: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        printType: PropTypes.string.isRequired,
        info: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        saleability: PropTypes.string.isRequired,
        pageCount: PropTypes.number.isRequired,
    })
};
export default BookCard;