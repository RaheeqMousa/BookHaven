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
// import { FacebookProvider, Login } from 'react-facebook';
import FacebookLogin from '@greatsumini/react-facebook-login';
import Back from '../../Components/Back';
import { UserContext } from '../../context/UserContext';
import { useContext } from 'react';
import { v4 as uuidv4 } from "uuid";

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

    const handleFacebookResponse = (response) => {
        console.log("Facebook Login Success:", response);

        if (response.accessToken) {
            const user = {
                name: response.name,
                email: response.email,
                facebookId: response.id,
                accessToken: response.accessToken
            };
            setUser(user);
            if (remember)
                localStorage.setItem("user", JSON.stringify(user));
            else
                sessionStorage.setItem("user", JSON.stringify(user));
            navigate('/');
        } else {
            setServerError("Facebook login failed");
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
                            {/* <FacebookProvider appId={FACEBOOK_KEY} version="v18.0">
                                <Login
                                    autoLoad={false}
                                    fields="id,name,email,picture"
                                    callback={handleFacebookResponse}
                                    onError={error => {
                                        console.error("Facebook login error:", error);
                                        setServerError("Facebook login failed");
                                    }}
                                    render={({ onClick }) => (
                                        <button onClick={onClick} className={`row justify-content-center`}>
                                            <RiFacebookCircleFill size={16} color='#333' />
                                            Sign up with Facebook
                                        </button>
                                    )}
                                />
                            </FacebookProvider> */}
                            <FacebookLogin
                                appId={FACEBOOK_KEY}
                                autoLoad={false}
                                fields="name,email,picture"
                                callback={handleFacebookResponse}
                                textButton="Continue with Facebook"
                            />
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