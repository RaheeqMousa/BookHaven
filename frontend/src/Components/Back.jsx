import React, { useCallback } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Back() {
    const navigate = useNavigate();
    const handleBack= useCallback(()=>{
        navigate(-1);
    },[navigate]);


    return (
        <div className={`width-100 row justify-content-start back`} >
            <FaArrowLeft size={16} color='#1A237E' />
            <button onClick={handleBack}>Back to BookHaven</button>
        </div>
    );
}
export default Back;