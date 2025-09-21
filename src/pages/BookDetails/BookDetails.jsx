import { useLocation } from "react-router-dom";
import Style from './BookDetails.module.scss'
import { Link } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";
import PreviewImg from '../../assets/Images/preview.svg'
import { LuBookOpen } from "react-icons/lu";
import { GrShare } from "react-icons/gr";
import { useCallback } from "react";
import { FiDownload } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { LuShare2 } from "react-icons/lu";
import { useState } from "react";

function BookDetails() {
    const location = useLocation();
    const book = location.state;
    const [detailsShow, setDetailsShow] = useState(true);

    const toggleDetailsShow=useCallback(()=>{
        setDetailsShow(!detailsShow)
    },[detailsShow,setDetailsShow])


    const joinAuthors = useCallback((authors) => {
        if (authors.length === 0) return "";
        if (authors.length === 1) return authors[0];
        if (authors.length === 2) return authors.join(" and ");
        return authors.slice(0, -1).join(", ") + ", and " + authors[authors.length - 1];
    }, []);
    if (!book) { return <p>No book selected</p> };



    return (
        <section className={`row flex-direction-column ${Style['details-section']}`}>
            <div className="container">
                <div className={`row flex-direction-column ${Style['book-row']}`}>
                    <Link to='/' className={`row ${Style.back}`} ><IoArrowBack size={16} color="#1A237E" />Back To Books</Link>
                    <section className={` ${Style.details}`}>
                        <div className={`row flex-direction-column ${Style['read-book']}`}>
                            <img
                                src={book.volumeInfo.imageLinks?.thumbnail || book.volumeInfo.imageLinks?.smallThumbnail}
                                alt={book.volumeInfo.title}
                                title={book.volumeInfo.title} width={448} height={600}
                            />

                            <div className={`row flex-direction-column ${Style['book-preview']}`}>
                                <button className="row justify-content-center">
                                    <img src={PreviewImg} width={16} height={16} />
                                    Preview This Book
                                </button>
                                <Link>Read preview pages</Link>
                            </div>

                            <button className={`row justify-content-center ${Style['read-online']}`}>
                                <LuBookOpen color="#1A237E" />
                                Read Online
                                <GrShare color="#1A237E" />
                            </button>
                        </div>
                        <div className={`row flex-direction-column ${Style['book-description']}`}>
                            <div className={`row ${Style.titles}`}>
                                <h1 className="width-100">{book.volumeInfo.title}</h1>
                                <h2 className={`width-100 ${Style['book-subtitle']}`}>
                                    {`${book.volumeInfo.subtitle ? book.volumeInfo.subtitle : ''} `}
                                </h2>
                                <p className="width-100">{book.volumeInfo.authors ? `by  ${joinAuthors(book.volumeInfo.authors)}` : ''}</p>
                                <div className={Style.categories}>
                                    {book.volumeInfo.categories &&
                                        book.volumeInfo.categories.map((cat, index) =>
                                            (<p className={Style.category} key={index}>{cat}</p>))
                                    }
                                </div>
                            </div>
                            <span className={`${Style['book-availability']}`}>
                                <strong className={book.saleInfo.saleability === "FREE" ? Style['buy-free'] : ''} >
                                    {book.saleInfo.saleability}
                                </strong>
                            </span>
                            <div className={`row flex-direction-column ${Style.about}`}>
                                <h3 className="width-100">About This Book</h3>
                                <div>
                                    <p>{book.volumeInfo.description}</p>
                                    <button>Read More</button>
                                </div>
                            </div>

                            <div className={`row ${Style.options}`}>
                                <button className="row justify-content-center">
                                    <FaRegHeart size={16} color="#333333" />
                                    Add to wishlist
                                </button>
                                <button><LuShare2 size={16} color="#333333" /></button>
                            </div>

                            <div className={`row flex-direction-column ${Style['download-options']}`}>
                                <p>Download Options:</p>
                                <button className="row">
                                    <FiDownload color="#333333" size={16} />
                                    PDF
                                </button>
                            </div>
                        </div>
                    </section>
                    
                    <section className={`row flex-direction-column ${Style['details-preview-info']}`}>
                        <div onClick={toggleDetailsShow} className={`width-100 row ${Style['display-settings']}`}>
                            <button className={detailsShow? Style.selected:''}>Details</button>
                            <button className={detailsShow? '':Style.selected}>Preview Info</button>
                        </div>
                        <div className={Style.previewed}>

                        </div>
                    </section>
                </div>
            </div>
        </section>
    );
}
export default BookDetails;