import ReadingImg from '../../assets/Images/Reading.jpg'
import { IoBookOutline } from "react-icons/io5";
import Style from '../../Styles/Auth.module.scss';
import LoginForm from '../../Components/LoginForm/LoginForm';
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import FormContainer from '../../Container/FormContainer';
import { useCallback } from 'react';
import { useState } from 'react';
import { RiFacebookCircleFill } from "react-icons/ri";
import { RiGoogleFill } from "react-icons/ri";
import { useGoogleLogin } from "@react-oauth/google";
import Back from '../../Components/Back';
import { UserContext } from '../../Context/UserContext';
import { useContext } from 'react';
import { v4 as uuidv4 } from "uuid";
import { loadFbSdk } from '../../Utils/facebooksdk';

function Signin() {
    const FACEBOOK_KEY = import.meta.env.VITE_FACEBOOK_APP_ID;
    const [serverError, setServerError] = useState('');
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext)

    const handleSignin = useCallback((data) => {
        setServerError("");

        const users = JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(u => u.email === data.email && u.password === data.password);

        if (!user) {
            setServerError("Wrong email or password");
            return;
        }

        setUser(user);

        if (!remember)
            sessionStorage.setItem("user", JSON.stringify(user));
        else if (remember)
            localStorage.setItem("user", JSON.stringify(user));

        navigate("/");
    }, [navigate, remember, setUser]);


    // let fbPromise = null;
    // const loadFbSdk = () => {
    //     if (fbPromise) return fbPromise;
    //     fbPromise = new Promise((resolve, reject) => {
    //         // If FB is already loaded, resolve immediately
    //         if (window.FB) {
    //             resolve(window.FB);
    //             return;
    //         }

    //         // Set up the FB async init
    //         window.fbAsyncInit = function () {
    //             try {
    //                 window.FB.init({
    //                     appId: FACEBOOK_KEY,
    //                     cookie: true,
    //                     xfbml: false,
    //                     version: "v17.0",
    //                 });
    //                 window.FB.AppEvents.logPageView();
    //                 resolve(window.FB);
    //             } catch (err) {
    //                 reject(err);
    //             }
    //         };

    //         // Avoid loading script twice
    //         if (!document.getElementById("facebook-jssdk")) {
    //             const script = document.createElement("script");
    //             script.src = "https://connect.facebook.net/en_US/sdk.js";
    //             script.id = "facebook-jssdk";
    //             script.async = true;
    //             script.onerror = () => reject(new Error("Failed to load Facebook SDK"));
    //             document.body.appendChild(script);
    //         }
    //     });

    //     return fbPromise;
    // };

    const handleFacebookLogin = async () => {
        try {
            const FB = await loadFbSdk('817641304279324');
            console.log(FB);
            if (!FB || !FB.login) {
                throw new Error('FB SDK not fully initialized');
            }
            FB.login((response) => {
                console.log(response)
                // if (response.authResponse) {
                //     FB.api("/me", { fields: "name,email,picture" }, (profile) => {
                //         const user = {
                //             name: profile.name,
                //             email: profile.email,
                //             facebookId: profile.id,
                //             accessToken: response.authResponse.accessToken,
                //             picture: profile.picture?.data?.url,
                //         };
                //         setUser(user);
                //         localStorage.setItem("user", JSON.stringify(user));
                //         navigate("/");
                //     });
                // } else {
                //     console.warn("Facebook login cancelled or failed");
                // }
            }, { scope: "email" });

        } catch (err) {
            console.error("Facebook SDK failed to load:", err);
        }
    };



    const signin = useGoogleLogin({
        onSuccess: async tokenResponse => {
            try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });
                const profile = await res.json();

                const users = JSON.parse(localStorage.getItem("users") || "[]");
                let user = users.find((u) => u.email === profile.email);

                if (!user) {

                    user = {
                        id: uuidv4(),
                        name: profile.name,
                        email: profile.email,
                        picture: profile.picture,
                    };
                    users.push(user);
                    localStorage.setItem("users", JSON.stringify(users));
                }

                if (remember) {
                    localStorage.setItem("user", JSON.stringify(user));
                } else {
                    sessionStorage.setItem("user", JSON.stringify(user));
                }

                setUser(user);
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
                                <Link to={'/auth/forgotpassword'} className={Style['forgot-password']}>Forgot password?</Link>
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
        </section>
    );
}
export default Signin;