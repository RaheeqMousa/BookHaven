import Email from '../../assets/Images/email-verification.png'
import api from "../../Utils/axios";
import { Link, useLocation } from 'react-router-dom';
import Style from '../../Styles/verification.module.scss';
import { useEffect, useState } from 'react';
import Notify from '../../Components/Notify/Notify';
import Back from '../../Components/Back';

function CheckEmailPage(){
    const location=useLocation();
    const email = location.state?.email;
    const [notify,setNotify]= useState(false);
    const [error,setError]= useState("");

    useEffect(()=>{
        if(notify){
            const timer= setTimeout(() => {
                setNotify(false);
            }, 3000);
            return ()=> clearTimeout(timer);
        }
    },[notify]);

    const resendCode = async () => {
        try{
            await api.post("/email_verification/resend_verification_code", { email });
            setNotify(true);
        }catch(e){
            console.log(e.response?.data?.detail || e.message)
            setError(e.response?.data?.detail || e.message)
        }
    };

    return(
        <div className={`row justify-content-center gap-16 ${Style['verify-layout']}`}>
            <div className={`row flex-direction-column align-start`}>
                <Back/>
            
                <div className={`${Style['card']}`}>
                    <h1>Check Your Email</h1>
                    <div className="row justify-content-center flex-direction-column gap-8">
                        <img src={Email} alt="email verification" width={200} height={200} title='email verification' />
                        <div className="row mt-16 justify-content-center flex-direction-column gap-8">
                            <p>We have sent an email verification to {email}.</p>
                            <p>click the link to complete the verification proccess.</p>
                            <p className={`${Style['error']}`}>{error}</p>
                            <button className={`mt-16 ${Style['resend-button']} `} onClick={resendCode}>Resend verification email</button>
                        </div>
                    </div>
                </div>
                {notify && <Notify message="Email resent successfully!"/> }
            </div>
        </div>
    );
}
export default CheckEmailPage;