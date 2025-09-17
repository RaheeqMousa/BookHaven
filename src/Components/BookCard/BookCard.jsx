import PropTypes from 'prop-types';
import Style from './BookCard.module.scss'
import { useCallback } from 'react';
function BookCard(props){
    const {book, isGridDisplay} = props;
    console.log(isGridDisplay)

    const joinAuthors = useCallback((authors) => {
        if (authors.length === 0) return "";
        if (authors.length === 1) return authors[0];
        if (authors.length === 2) return authors.join(" and ");
        return authors.slice(0, -1).join(", ") + ", and " + authors[authors.length - 1];
    },[]);

    return (
        <div className={`${isGridDisplay? '':Style['list-display']} ${Style['book-card']}`}>
            <div className={Style['book-cover']}>
                <img 
                    src={book.volumeInfo.imageLinks?.smallThumbnail || book.volumeInfo.imageLinks?.thumbnail}
                    alt={book.volumeInfo.title} 
                    title={book.volumeInfo.title}  width={168} height={180}
                />
                <p>{book.volumeInfo.printType}</p>
            </div>

            <div className={`row flex-direction-column ${Style.info}`}>
                {book.volumeInfo.categories? <p className={Style.category}>{ book.volumeInfo.categories[0]}</p> : ''}
                <div className={Style.titles}>    
                    <h3>{book.volumeInfo.title}</h3>
                    <p className={`${Style['book-subtitle']}`}>
                        {`${book.volumeInfo.subtitle? book.volumeInfo.subtitle: ''} ${book.volumeInfo.authors? `by  ${joinAuthors(book.volumeInfo.authors)}`: ''}`}
                    </p>
                </div>
                <span className={`${Style['book-availability']}`}><strong>{book.saleInfo.saleability}</strong> {book.volumeInfo.pageCount ? `${book.volumeInfo.pageCount} pages` : ''}</span>
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
    }),
    isGridDisplay: PropTypes.bool.isRequired
};
export default BookCard;