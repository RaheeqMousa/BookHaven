import { useState } from "react";
import api from "../../Utils/axios";
import Style from '../../Styles/Auth.module.scss';
import ReadingImg from '../../assets/Images/Reading.jpg'
import { IoBookOutline } from "react-icons/io5";
import Styles from "../../Styles/verification.module.scss";
import FormContainer from "../../Container/FormContainer";
import { useCallback } from "react";
import Back from "../../Components/Back";

function SendResetCode() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [email,setEmail]= useState("");
    

    const handleSend = async () => {
        try {
            setLoading(true);
            setError("");

            await api.post("/password_reset/send_password_reset_email", {
            email,
            });

            
        } catch (err) {
            console.log("Axios error:", err);

            const data = err.response?.data;
            let message = "Signup failed";

            if (data) {
                if (Array.isArray(data.detail)) {
                    // If backend returns an array of errors
                    message = data.detail.map(e => e.msg).join(", ");
                } else if (typeof data.detail === "string") {
                    // If backend returns a simple string message
                    message = data.detail;
                }
            }

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = useCallback((e) => {
        setEmail(e.target.value);
    }, []);

  return (
    <div className={`row justify-content-center gap-16 ${Styles['verify-layout']}`}>
        <div className={`row flex-direction-column align-start `}>
        <Back/>
        <div className={`flex align-items-center justify-items-center ${Styles['card']}`}>
            <FormContainer
                onSubmit={handleSend}
                serverError={error}
                initialData={null}
                
            >
                <h2>Send Reset Code</h2>
                <div className="field flex gap-2 justify-content-center justify-items-center width-100">
                    <label>Email Address: </label>
                    <input 
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                        required 
                    />
                </div>
                <button type="submit" disabled={loading} className={Styles['reset-pass']}>
                    {loading ? "Sending..." : "Send Reset Password Email"}
                </button>
            </FormContainer>

        </div>
        </div>
        </div>
  );
}

export default SendResetCode;
