import { useState } from "react";
import api from "../../Utils/axios";
import Style from '../../Styles/Auth.module.scss';
import ReadingImg from '../../assets/Images/Reading.jpg'
import { IoBookOutline } from "react-icons/io5";
import styles from "./SendResetCode.module.css";
import FormContainer from "../../Container/FormContainer";
import { useCallback } from "react";

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
    <section className={Style['auth-layout']}>
            <div className={Style['auth-design-wrapper']}>
                <img src={ReadingImg} width={400} height={300} alt='Reading journey image' title='Reading journey Image' />
                <div className={`row justify-content-center flex-direction-column ${Style['auth-design']}`}>
                    <div className={`row ${Style.logo}`}>
                        <div className={`row justify-content-center align-items-center ${Style.icon}`}>
                            <IoBookOutline size={28} color='#1A237E' />
                        </div>
                        BookHaven
                    </div>
                    <h1>Welcome Back to Your <span>Literary Journey</span></h1>
                    <p>Sign in to access your personal library, continue
                        reading, and discover new books tailored just for you.</p>
                    <div className={`row ${Style.dividers}`}>
                        <div className={Style.divider}>

                        </div>
                        <div className={Style.divider}>

                        </div>
                        <div className={Style.divider}>

                        </div>
                    </div>
                </div>
            </div>
        <div className={'flex align-items-center justify-items-center '}>
            <FormContainer
                onSubmit={handleSend}
                serverError={error}
                initialData={null}
                
            >
                <h2>Send Reset Code</h2>
                <div className="field flex gap-2 justify-items-center justify-items-center width-50">
                    <label>Email Address: </label>
                    <input 
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                        required 
                    />
                </div>
                <button type="submit" disabled={loading} className={styles['send-code-btn']}>
                    {loading ? "Sending..." : "Send Reset Password Email"}
                </button>
            </FormContainer>

        </div>
    </section>
  );
}

export default SendResetCode;
