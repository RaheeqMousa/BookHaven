import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import api from "../../Utils/axios";
import { UserContext } from "../../Context/UserContext";
import Style from '../../Styles/Auth.module.scss';
import ReadingImg from '../../assets/Images/Reading.jpg'
import { IoBookOutline } from "react-icons/io5";
import styles from "./ResetPassword.module.css";
import FormContainer from "../../Container/FormContainer";
import { useCallback } from "react";
import { useLocation } from "react-router-dom";

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email");
    const token = queryParams.get("code");

    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    
    const handleResetPassword = async () => {
        
        try {
            console.log(email, token, newPassword);
            setLoading(true);
            setError("");

            await api.post("/password_reset/reset_password", {
                email:email,
                token:token,
                new_password:newPassword,
            });

            navigate("/auth/login");
        } catch (err) {
            console.log("Axios error:", err);
            const data = err.response?.data;
            let message = "Reset failed";

            if (data) {
                if (Array.isArray(data.detail)) {
                    message = data.detail.map(e => e.msg).join(", ");
                } else if (typeof data.detail === "string") {
                    message = data.detail;
                }
            }

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = useCallback((e) => {
        setNewPassword(e.target.value);
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
        <div className={'flex align-items-center justify-items-center'}>
            <FormContainer
                onSubmit={handleResetPassword}
                serverError={error}
                initialData={null}
            >
                <h2>Reset Password</h2>
                <div className="field flex gap-2 justify-items-center justify-items-center width-50">
                    <label>New Password: </label>
                    <input 
                        type="password"
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        required 
                    />
                </div>
                <button type="submit" disabled={loading} className={styles['submit-btn']}>
                    {loading ? "Submitting..." : "Reset Password"}
                </button>
            </FormContainer>

        </div>
    </section>
  );
}

export default ResetPassword;
