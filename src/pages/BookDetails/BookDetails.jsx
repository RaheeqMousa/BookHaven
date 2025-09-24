import {  useLocation } from "react-router-dom";
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
import { useMemo } from "react";
import { getBookDetails } from "./constants";
import PropTypes from "prop-types";
import useWish from '../../Hooks/useWish';
import { FaHeart } from "react-icons/fa6";
import { joinAuthors } from "../../Utils/JoinAuthors";

function BookDetails() {
    const location = useLocation();
    const book = location.state;
    const [isWished, toggleWish] = useWish(book);
    const [detailsShow, setDetailsShow] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [shareBtnSuccess, setShareBtnSuccess] = useState('')
    const [disableShareBtn, setShareBtnDisable] = useState(false);
    // const [message, setMessage] = useState("");
    // const navigate = useNavigate();

    const toggleRead = useCallback(() => {
        setIsExpanded(!isExpanded);
    }, [isExpanded, setIsExpanded])

    const toggleDetailsShow = useCallback(() => {
        setDetailsShow(!detailsShow)
    }, [detailsShow, setDetailsShow])



    const handleWishlistClick = useCallback(
        (e) => {
            e.stopPropagation();//to prevent <Link> navigation
            e.preventDefault();
            toggleWish();
        },
        [toggleWish]
    );

    const preview = book.volumeInfo.description
        ? book.volumeInfo.description.slice(0, 200) : "";
    const isLong = useMemo(() =>
        book.volumeInfo.description?.length > 200,
        [book]);

    const handleShare = useCallback(async () => {
        const shareData = {
            title: book.volumeInfo.title,
            text: `${book.volumeInfo.title} by ${joinAuthors(book.volumeInfo.authors)}`,
            url: book.volumeInfo.canonicalVolumeLink,
        };

        setShareBtnDisable(false);
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log("Shared successfully!");
            } catch (err) {
                console.error("Share failed:", err);
            }
        } else {
            navigator.clipboard.writeText(shareData.url);
            setShareBtnSuccess("Link copied to clipboard!");
            setTimeout(() => {
                setShareBtnSuccess("");
                setShareBtnDisable(true);
            }, 1000);
        }
    }, [book]);


    // const handleAddToWishlist = useCallback((book) => {
    //     if (!localStorage.getItem('user')) {
    //         navigate('/auth/login');
    //         return;
    //     }

    //     const storedCart = JSON.parse(localStorage.getItem('wishlist')) || [];

    //     if (!storedCart.some((item) => item.id === book.id)) {
    //         const newCart = [...storedCart, book];
    //         localStorage.setItem('cart', JSON.stringify(newCart));
    //         setMessage(`${book.volumeInfo.title} added to wishlist!`);
    //         setTimeout(() => setMessage(""), 2000);
    //     } else {
    //         setMessage(`${book.volumeInfo.title} is already in your wishlist.`);
    //         setTimeout(() => setMessage(""), 2000);
    //     }
    // }, [navigate]);


    if (!book) { return <p>No book selected</p>; }


    return (
        <section className={`row flex-direction-column ${Style['details-section']}`}>
            <div className="container">
                <div className={`row flex-direction-column ${Style['book-row']}`}>
                    <Link to='/' className={`row align-start ${Style.back}`} ><IoArrowBack size={16} color="#1A237E" />Back To Books</Link>
                    <section className={` ${Style.details}`}>
                        <div className={`row flex-direction-column ${Style['read-book']}`}>
                            <img
                                src={book.volumeInfo.imageLinks?.thumbnail || book.volumeInfo.imageLinks?.smallThumbnail}
                                alt={book.volumeInfo.title}
                                title={book.volumeInfo.title} width={448} height={600}
                            />

                            <div className={`row flex-direction-column ${Style['book-preview']}`}>
                                <a href={book.volumeInfo.previewLink} target="_blank" rel="noopener noreferrer" className="row justify-content-center">
                                    <img src={PreviewImg} width={16} height={16} />
                                    Preview This Book
                                </a>
                                <p>Read preview pages</p>
                            </div>

                            <a href={book.accessInfo.webReaderLink} target="_blank" rel="nooopener noreferrer" className={`row justify-content-center ${Style['read-online']}`} >
                                <LuBookOpen color="#1A237E" />
                                Read Online
                                <GrShare color="#1A237E" />
                            </a>
                        </div>
                        <div className={`row flex-direction-column ${Style['book-description']}`}>
                            <div className={`width-100 row ${Style.titles}`}>
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
                                    <p>
                                        {isExpanded || !isLong
                                            ? book.volumeInfo.description
                                            : `${preview}...`}
                                    </p>
                                    {isLong && (
                                        <button
                                            onClick={toggleRead}
                                            className="text-blue-500 font-semibold mt-2"
                                        >
                                            {isExpanded ? "Read Less" : "Read More"}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className={`row ${Style.options}`}>
                                <button className="row justify-content-center" onClick={handleWishlistClick}>
                                    {!isWished ? (
                                        <>
                                            <FaRegHeart size={16} color="#333333" />
                                            <span>Add to wishlist</span>
                                        </>
                                    ) : (
                                        <FaHeart size={16} color="red" />
                                    )}
                                </button>
                                <button disabled={disableShareBtn} onClick={handleShare} aria-label="Share book button">{shareBtnSuccess ? shareBtnSuccess : <LuShare2 size={16} color="#333333" />}</button>
                            </div>

                            <div className={`row flex-direction-column ${Style['download-options']}`}>
                                <p>Download Options:</p>
                                <a className="row" href={
                                    book.accessInfo?.pdf?.isAvailable
                                        ? book.accessInfo.pdf.acsTokenLink
                                        : book.accessInfo?.epub?.isAvailable
                                            ? book.accessInfo.epub.acsTokenLink
                                            : "#"
                                }
                                    download={`${book.volumeInfo.title}${book.accessInfo?.pdf?.isAvailable ? ".pdf" : ".epub"
                                        }`}>
                                    <FiDownload color="#333333" size={16} />
                                    PDF
                                </a>
                            </div>
                        </div>
                    </section>

                    <section className={`row flex-direction-column ${Style['details-preview-info']}`}>
                        <div onClick={toggleDetailsShow} className={`width-100 row ${Style['display-settings']}`}>
                            <button className={detailsShow ? Style.selected : ''}>Details</button>
                            <button className={detailsShow ? '' : Style.selected}>Preview Info</button>
                        </div>
                        <div className={`width-100 ${Style.previewed}`}>
                            <div className={`row ${Style.cells}`}>
                                {detailsShow ? getBookDetails(book).map((detail, index) => (
                                    <div key={index} className="row">
                                        <p>{detail.label}:</p>
                                        <p>{detail.value}</p>
                                    </div>
                                )) : ''}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    );
}


BookDetails.propTypes = {
    book: PropTypes.shape({
        volumeInfo: PropTypes.shape({
            title: PropTypes.string.isRequired,
            subtitle: PropTypes.string,
            authors: PropTypes.arrayOf(PropTypes.string),
            categories: PropTypes.arrayOf(PropTypes.string),
            description: PropTypes.string,
            imageLinks: PropTypes.object,
            previewLink: PropTypes.string,
        }).isRequired,
        saleInfo: PropTypes.object,
        accessInfo: PropTypes.object,
        
    }),
};

export default BookDetails;