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
import * as jwt_decode from "jwt-decode";
import { FacebookProvider, Login } from 'react-facebook';


function Signin() {
    const FACEBOOK_KEY=import.meta.env.VITE_FACEBOOK_APP_ID;
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const handleSignin = useCallback((formData) => {
        setServerError('');

        if (!formData.email || !formData.password) {
            setServerError('All fields are required');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.filter(user => user.email === formData.email && user.password === formData.password);

        if (!userExists) {
            setServerError('Wrong email or password');
            return;
        }

        sessionStorage.setItem('user', JSON.stringify(formData)); //if chose remember me

        navigate('/user/profile');
    }, [setServerError, navigate]);

    const handleFacebookResponse = (response) => {
        console.log("Facebook Login Success:", response);

        if (response.accessToken) {
            const user = {
                name: response.name,
                email: response.email,
                facebookId: response.id,
                accessToken: response.accessToken
            };
            localStorage.setItem("user", JSON.stringify(user));
            navigate('/user/profile');
        } else {
            setServerError("Facebook login failed");
        }
    };

    const signin = useGoogleLogin({
        onSuccess: tokenResponse => {
            const decoded = jwt_decode(tokenResponse.credential);
            console.log("Google Login Success:", decoded);
            const user = {
                name: decoded.name,
                email: decoded.email,
                password: decoded.password
            };
            localStorage.setItem("user", JSON.stringify(user));

            navigate('/user/profile');
        },
        onError: () => {
            console.log("Login Failed");
            setServerError("Login Failed");
        },
        flow: "implicit"
    });

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
                    <div className={`width-100 row justify-content-start ${Style.back}`} >
                        <FaArrowLeft size={16} color='#1A237E' />
                        <Link to="/">Back to BookHaven</Link>
                    </div>
                    <div className={`row flex-direction-column align-start ${Style.heading}`}>
                        <h2>Sign In</h2>
                        <p>Enter your credentials to access your account</p>
                    </div>
                    <div className={`row flex-direction-column ${Style.processes}`}>
                        <FormContainer onSubmit={handleSignin} serverError={serverError} initialData={null} type="Sign In">
                            <LoginForm />
                            <div className='row width-100'>
                                <div className={`row ${Style['remember-me']}`}>
                                    <input type='checkbox' />
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
                            <FacebookProvider appId={FACEBOOK_KEY} version="v18.0">
                                <Login
                                    autoLoad={false}
                                    fields="id,name,email,picture"
                                    scope="email"
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
                            </FacebookProvider>
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