import { useLocation } from "react-router-dom";
import Style from './BookDetails.module.scss'
import { Link } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";
import PreviewImg from '../../assets/Images/preview.svg'
import { LuBookOpen } from "react-icons/lu";
import { GrShare } from "react-icons/gr";

function BookDetails() {
    const location = useLocation();
    const book = location.state;

    if (!book) return <p>No book selected</p>;

    return (
        <section className={`row flex-direction-column ${Style['details-section']}`}>
            <div className="container">
                <div className={`row flex-direction-column ${Style['book-row']}`}>
                    <Link to='/' className="row" ><IoArrowBack size={16} color="#1A237E" />Back To Books</Link>
                    <div className={Style.details}>
                        <div className={`row flex-direction-column ${Style['read-book']}`}>
                            <img
                                src={book.volumeInfo.imageLinks?.thumbnail || book.volumeInfo.imageLinks?.smallThumbnail}
                                alt={book.volumeInfo.title}
                                title={book.volumeInfo.title} width={448} height={600}
                            />

                            <div>  
                                <button> 
                                    <img src={PreviewImg} width={16} height={16}  />
                                    Preview This Book
                                </button>
                                <Link>Read preview pages</Link>
                            </div>

                            <button>
                                <LuBookOpen color="white" />
                                Read Online
                                <GrShare color="white" />
                            </button>
                        </div>
                        <div className={`row flex-direction-column ${Style['book-description']}`}>

                        </div>
                    </div>
                    <div className={`row flex-direction-column ${Style['book-info']}`}>

                    </div>
                </div>
            </div>
        </section>
    );
}
export default BookDetails;