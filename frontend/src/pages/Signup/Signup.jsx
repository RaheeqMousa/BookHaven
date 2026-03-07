import ReadingImg from '../../assets/Images/Reading.jpg'
import { IoBookOutline } from "react-icons/io5";
import Style from '../../Styles/Auth.module.scss';
import SignupForm from '../../Components/SignupForm/SignupForm';
import { Link, useNavigate } from "react-router-dom";
import FormContainer from '../../Container/FormContainer';
import { useCallback } from 'react';
import { useState } from 'react';
import { RiFacebookCircleFill } from "react-icons/ri";
import { RiGoogleFill } from "react-icons/ri";
import { useGoogleLogin } from "@react-oauth/google";
import Back from '../../Components/Back';
import { UserContext } from '../../Context/UserContext';
import { loadFbSdk, resetFbSdk } from '../../Utils/facebooksdk';
import api from "../../Utils/axios";

function Signup() {
    const FACEBOOK_KEY = import.meta.env.VITE_FACEBOOK_APP_ID;
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = useCallback(async (formData) => {
        try {
            setServerError('');
            setLoading(true);

            if (!formData.username || !formData.email || !formData.password) {
                setServerError('All fields are required');
                setLoading(false);
                return;
            }

            const res=await api.post("/auth/signup", {
            username: formData.username,
            password: formData.password,
            email: formData.email, 
            });
            console.log(res)
            navigate("/auth/check-email", {
                state: { email: formData.email }
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

            setServerError(message);
        } finally {
            setLoading(false);
        }
    }, [navigate]);



    const handleFacebookLogin = useCallback( async () => {
        try {
            resetFbSdk();
            const FB = await loadFbSdk(FACEBOOK_KEY);
            if (!FB || !FB.login) {
                throw new Error('FB SDK not fully initialized');
            }
            FB.login(
                (response) => {
                    if (response.authResponse) {
                        FB.api(
                            "/me",
                            { fields: "name,email,picture" },
                            async (profile) => {

                                const r= await api.post("/auth/facebook", {
                                    id: profile.id,
                                    name: profile.name,
                                    email: profile.email,
                                })

                                sessionStorage.setItem("user", JSON.stringify(r.data.access_token));
                                navigate("/");
                            }
                        );


                    } else {
                        console.warn("Facebook login cancelled or failed");
                    }
                },
                { scope: "email,public_profile" }
            );

        } catch (err) {
            console.error("Facebook SDK failed to load:", err);
        }
    },[FACEBOOK_KEY, navigate]);

    const signup = useGoogleLogin({
        onSuccess: async tokenResponse => {
            try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });
                const profile = await res.json(); // <-- Fetch profile first

                const r= await api.post("/auth/google", {
                    sub: profile.sub,
                    name: profile.name,
                    email: profile.email,
                })
                sessionStorage.setItem("user", JSON.stringify(r.data.access_token));
                navigate("/");
            } catch (e) {
                setServerError("Google login failed", e);
            }
        },
        onError: () => {
            setServerError("Login Failed");
        },
        flow: "implicit"
    });



    return (
            <div className={`row justify-content-center ${Style['auth-section']}`}>
                <div className={`row flex-direction-column align-start ${Style['auth-process']}`}>
                    <Back />
                    <div className={`row flex-direction-column align-start ${Style.heading}`}>
                        <h2>Sign Up</h2>
                        <p>Enter your credentials to create an account</p>
                    </div>
                    <div className={`row flex-direction-column ${Style.processes}`}>
                        <FormContainer onSubmit={handleSignup} serverError={serverError} initialData={null} type="Sign Up" isLoading={loading}>
                            <SignupForm/>
                        </FormContainer>

                        <p className={Style['auth-divider']}>or</p>


                        <div className={`row flex-direction-column width-100 ${Style['auth-external']}`}>
                            <button className={`row justify-content-center`} onClick={signup} disabled={loading}>
                                <RiGoogleFill size={16} color='#333' />
                                Continue with Google
                            </button>
                            <button className={`row justify-content-center`} onClick={handleFacebookLogin} disabled={loading}>
                                <RiFacebookCircleFill size={16} color='#333' />
                                Continue with Facebook
                            </button>
                        </div>

                        <p className={`row ${Style['navigate-other-auth']}`}>
                            Already have an account?
                            <Link to={'/auth/login'}>Sign In Now!</Link>
                        </p>

                    </div>
                </div>
            </div>
    );
}
export default Signup;