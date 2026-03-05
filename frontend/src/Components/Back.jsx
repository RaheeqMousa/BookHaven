import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

function Back() {

    return (
        <div className={`width-100 row justify-content-start back`} >
            <FaArrowLeft size={16} color='#1A237E' />
            <Link to="/" className="btn btn-link">
                Back to BookHaven
            </Link>
        </div>
    );
}
export default Back;