import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import api from "../../Utils/axios";
import { UserContext } from "../../Context/UserContext";
import Style from '../../Styles/Auth.module.scss';
import ReadingImg from '../../assets/Images/Reading.jpg'
import { IoBookOutline } from "react-icons/io5";
import FormContainer from "../../Container/FormContainer";
import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import Back from "../../Components/Back";
import Styles from '../../Styles/verification.module.scss'

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email");
    const token = queryParams.get("code");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    
    const handleResetPassword = async () => {
        
        try {
            // Validate passwords match
            if (newPassword !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            if (!newPassword || newPassword.length < 8) {
                setError("Password must be at least 8 characters long");
                return;
            }

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

    const handleConfirmPasswordChange = useCallback((e) => {
        setConfirmPassword(e.target.value);
    }, []);

  return (
    <div className={`row justify-content-center gap-16 ${Styles['verify-layout']}`}>
        <div className={`row flex-direction-column align-start `}>
                <Back/>
        <div className={`flex align-items-center justify-items-center ${Styles['card']}`}>
            <FormContainer
                onSubmit={handleResetPassword}
                serverError={error}
                initialData={null}
            >
                <h2>Reset Password</h2>
                <div className="field flex gap-2 justify-items-center justify-items-center width-100">
                    <label>New Password: </label>
                    <input 
                        type="password"
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        required 
                    />
                </div>
                <div className="field flex gap-2 justify-items-center justify-items-center width-100">
                    <label>Confirm Password: </label>
                    <input 
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required 
                    />
                </div>
                <button type="submit" disabled={loading} className={`${Styles['reset-pass']} `}>
                    {loading ? "Submitting..." : "Reset Password"}
                </button>
            </FormContainer>

        </div>
        </div>
    </div>
  );
}

export default ResetPassword;
