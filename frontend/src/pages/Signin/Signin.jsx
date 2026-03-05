import ReadingImg from '../../assets/Images/Reading.jpg'
import { IoBookOutline } from "react-icons/io5";
import Style from '../../Styles/Auth.module.scss';
import LoginForm from '../../Components/LoginForm/LoginForm';
import { Link, useNavigate } from "react-router-dom";
import FormContainer from '../../Container/FormContainer';
import { useCallback } from 'react';
import { useState } from 'react';
import { RiFacebookCircleFill } from "react-icons/ri";
import { RiGoogleFill } from "react-icons/ri";
import { useGoogleLogin } from "@react-oauth/google";
import Back from '../../Components/Back';
import { UserContext } from '../../Context/UserContext';
import { useContext } from 'react';
import { loadFbSdk, resetFbSdk } from '../../Utils/facebooksdk';
import api from "../../Utils/axios";

function Signin() {
    const FACEBOOK_KEY = import.meta.env.VITE_FACEBOOK_APP_ID;
    const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BURL;
    const [serverError, setServerError] = useState('');
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext)

    const handleSignin = useCallback(async (data) => {
        try {
            setServerError("");

            const res = await api.post("/auth/signin", data);

            const token= res.data.access_token;
            const tokenExpiry = Date.now() + 60 * 60 * 1000;
            const user = {
                username: res.data.username,
                email: res.data.email,
                token: token,
                tokenExpiry: tokenExpiry,
            };

            setUser(user);
            console.log(res)

            if (remember){
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
            }else{
                sessionStorage.setItem("token", token);
                sessionStorage.setItem("user", JSON.stringify(user));
            }
            navigate("/");
        } catch (err) {
            setServerError(
                err.response?.data?.message || "Wrong email or password"
            );
        }
    },[navigate, remember, setUser]);


    const handleFacebookLogin = useCallback(
        async () => {
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

                                if (remember) {
                                    localStorage.setItem("user", JSON.stringify(r.data.access_token));
                                } else {
                                    sessionStorage.setItem("user", JSON.stringify(r.data.access_token));
                                }

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
    },[FACEBOOK_KEY, navigate, remember]);


    const signin = useGoogleLogin({
        onSuccess: async tokenResponse => {
            try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });
                const profile = await res.json();

                const r= await api.post("/auth/google", {
                    sub: profile.sub,
                    name: profile.name,
                    email: profile.email,
                })

                if (remember) {
                    localStorage.setItem("user", JSON.stringify(r.data.access_token));
                } else {
                    sessionStorage.setItem("user", JSON.stringify(r.data.access_token));
                }
                navigate("/");
            } catch (e) {
                setServerError("Google login failed ", e);
            }
        },
        onError: () => {
            setServerError("Google login failed");
        },
        flow: "implicit"
    });

    const handleCheckboxChange = useCallback(() => {
        setRemember(!remember)
    }, [remember]);

    return (
            <div className={`row justify-content-center ${Style['auth-section']}`}>
                <div className={`row flex-direction-column align-start ${Style['auth-process']}`}>
                    <Back />

                    <div className={`row flex-direction-column align-start ${Style.heading}`}>
                        <h2>Sign In</h2>
                        <p>Enter your credentials to access your account</p>
                    </div>
                    <div className={`row flex-direction-column ${Style.processes}`}>
                        <FormContainer onSubmit={handleSignin} serverError={serverError} initialData={null} type="Sign In">
                            <LoginForm />
                            <div className='row width-100'>
                                <div className={`row ${Style['remember-me']}`}>
                                    <input type='checkbox' onChange={handleCheckboxChange} />
                                    <p>Remember me</p>
                                </div>
                                <Link to={'/auth/forgot-password'} className={Style['forgot-password']}>Forgot password?</Link>
                            </div>
                        </FormContainer>


                        <p className={Style['auth-divider']}>or</p>


                        <div className={`row flex-direction-column width-100 ${Style['auth-external']}`}>
                            <button className={`row justify-content-center`} onClick={signin}>
                                <RiGoogleFill size={16} color='#333' />
                                Continue with Google
                            </button>

                            <button className={`row justify-content-center`} onClick={handleFacebookLogin}>
                                <RiFacebookCircleFill size={16} color='#333' />
                                Continue with Facebook
                            </button>

                        </div>

                        <p className={`row ${Style['navigate-other-auth']}`}>
                            Don't have an account?
                            <Link to={'/auth/register'}>Sign up for free</Link>
                        </p>

                    </div>
                </div>
            </div>
    );
}
export default Signin;