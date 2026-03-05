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
import { useContext } from 'react';
import { UserContext } from '../../Context/UserContext';
import { loadFbSdk, resetFbSdk } from '../../Utils/facebooksdk';
import api from "../../Utils/axios";

function Signup() {
    const { setUser } = useContext(UserContext);
    const FACEBOOK_KEY = import.meta.env.VITE_FACEBOOK_APP_ID;
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const handleSignup = useCallback(async (formData) => {
        try {
            setServerError('');

            if (!formData.username || !formData.email || !formData.password) {
                setServerError('All fields are required');
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
        }}, [navigate]);



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
                            (profile) => {
                                console.log(profile);
                                const users = JSON.parse(localStorage.getItem("users") || "[]");
                                let user = users.find((u) => u.id === profile.id);

                                if (user) {
                                    setServerError("User with this facebook account already exists.");
                                    return;
                                }

                                user = {
                                    id: profile.id,
                                    name: profile.name,
                                    email: profile.email,
                                };

                                users.push(user);
                                localStorage.setItem("users", JSON.stringify(users));

                                sessionStorage.setItem("user", JSON.stringify(user));
                                setUser(user);
                                navigate('/');

                                console.log("Logged in user:", user);
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
    },[FACEBOOK_KEY, navigate, setUser]);

    const signup = useGoogleLogin({
        onSuccess: async tokenResponse => {
            try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });
                const profile = await res.json(); // <-- Fetch profile first

                const users = JSON.parse(localStorage.getItem("users") || "[]");
                let user = users.find((u) => u.id === profile.sub);

                if (user) {
                    setServerError("User with this email already exists.");
                    return;
                }

                user = {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                };

                users.push(user);
                localStorage.setItem("users", JSON.stringify(users));
                sessionStorage.setItem("user", JSON.stringify(user));
                setUser(user);
                navigate('/');
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
                        <FormContainer onSubmit={handleSignup} serverError={serverError} initialData={null} type="Sign Up">
                            <SignupForm/>
                            {/* <>
                            <div className='row width-100'>
                                <div className={`row ${Style['remember-me']}`}>
                                    <input type='checkbox' onChange={handleCheckboxChange} />
                                    <p>Remember me</p>
                                </div>
                            </div>
                            </> */}
                        </FormContainer>

                        <p className={Style['auth-divider']}>or</p>


                        <div className={`row flex-direction-column width-100 ${Style['auth-external']}`}>
                            <button className={`row justify-content-center`} onClick={signup}>
                                <RiGoogleFill size={16} color='#333' />
                                Continue with Google
                            </button>
                            <button className={`row justify-content-center`} onClick={handleFacebookLogin}>
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