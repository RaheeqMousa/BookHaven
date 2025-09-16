import Style from './BookCard.module.scss'
function BookCard(props){
    const {book} = props;

    return (
        <div className={Style['book-card']}>
            <div className={Style['book-cover']}>
                <img 
                    src={book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail} 
                    alt={book.title} 
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
export default BookCard;