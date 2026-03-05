import { useState, useCallback} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../Utils/axios";
import { UserContext } from "../../Context/UserContext";
import ReadingImg from '../../assets/Images/Reading.jpg'
import { IoBookOutline } from "react-icons/io5";
import { useEffect } from "react";
import FormContainer from "../../Container/FormContainer";
import Style from '../../Styles/verification.module.scss';
import Back from "../../Components/Back";

function VerifyEmail() {
  const location=useLocation();
  const params= new URLSearchParams(location.search);
  const token = params.get('token');
  const email = params.get('email');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [msg,setMsg]= useState("")

  const checkToken = useCallback(async () => {
    try{
      console.log(token, email)
      if (!token || !email) {
        alert("Invalid verification link");
        return;
      }
      const res= await api.post('/email_verification/verify_code',{
        email:email,
        code:token
      })
      
      setMsg(res.data.message || "Email verified successfully!");
      setLoading(false);
      setTimeout(() => navigate("/auth/login"), 2000);
    }catch(e){
      console.log(e.response?.data?.detail || e.message)
      setMsg(e.response?.data?.detail || e.message)
    }finally{
      setLoading(false);
    }
  
  },[email, token, navigate])

  useEffect(()=>{
    checkToken();
  },[checkToken])


  return (  
     <div className={`row justify-content-center gap-16 ${Style['verify-layout']}`}>
                    <div className={`row flex-direction-column align-start`}>
                <Back/>
       
            <div className={Style.card}>
              <h2>Verify Email</h2>
              <p className={`mt-8`}>{loading? "Verifying code...":msg}.</p>
            </div>
          </div>
          </div>
  );
}

export default VerifyEmail;
