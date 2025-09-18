import PropTypes from 'prop-types';
import Style from './BookCard.module.scss'
import { useCallback } from 'react';
import { CiHeart } from "react-icons/ci";
import { LuShoppingCart } from "react-icons/lu";

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
                <div>
                    {book.saleInfo.saleability==="FREE"? <p className={Style.free}>FREE</p>:''}
                    <button aria-label='Add to wishlist button' className={`row justify-content-center ${Style.wishlist}`}><CiHeart size={16} /></button>
                </div>
                <img 
                    src={book.volumeInfo.imageLinks?.smallThumbnail || book.volumeInfo.imageLinks?.thumbnail}
                    alt={book.volumeInfo.title} 
                    title={book.volumeInfo.title}  width={168} height={180}
                />
                <div>
                    <p className={Style.printype}>{book.volumeInfo.printType}</p>
                    <div className={`row ${Style['quick-add-wrapper']}`}>
                        <button className={`row justify-content-center ${Style['quick-add']}`}>
                            <LuShoppingCart size={16}/> Quick Add
                            <p className={`row justify-content-center ${Style['preview']}`}>Preview</p>
                        </button>
                    </div>
                </div>
                
            </div>

            <div className={`row flex-direction-column ${Style.info}`}>
                {book.volumeInfo.categories && 
                    book.volumeInfo.categories.map((cat,index)=>
                   (<p className={Style.category} key={index}>{cat}</p>))
                }

                <div className={Style.titles}>    
                    <h3>{book.volumeInfo.title}</h3>
                    <p className={`${Style['book-subtitle']}`}>
                        {`${book.volumeInfo.subtitle? book.volumeInfo.subtitle: ''} `}
                    </p>
                    <p>{book.volumeInfo.authors? `by  ${joinAuthors(book.volumeInfo.authors)}`: ''}</p>
                </div>

                <span className={`${Style['book-availability']}`}>
                    <strong className={book.saleInfo.saleability === "FREE" ? Style['buy-free'] : ''} >
                        {book.saleInfo.saleability}
                    </strong> 
                    <p>{book.volumeInfo.pageCount ? `${book.volumeInfo.pageCount} pages` : ''}</p>
                </span>
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