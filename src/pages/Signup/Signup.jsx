import ReadingImg from '../../assets/Images/Reading.jpg'
import { IoBookOutline } from "react-icons/io5";
import Style from '../../Styles/Auth.module.scss';
import SignupForm from '../../Components/SignupForm/SignupForm';
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import FormContainer from '../../Container/FormContainer';
import { useCallback } from 'react';
import { useState } from 'react';
import { RiFacebookCircleFill } from "react-icons/ri";
import { RiGoogleFill } from "react-icons/ri";
import { useGoogleLogin } from "@react-oauth/google";
import { FacebookProvider, Login } from 'react-facebook';
import Back from '../../Components/Back';
import { v4 as uuidv4 } from "uuid";
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import FacebookLogin from '@greatsumini/react-facebook-login';


function Signup() {
    const { setUser } = useContext(UserContext);
    const FACEBOOK_KEY = import.meta.env.VITE_FACEBOOK_APP_ID;
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const handleSignup = useCallback((formData) => {
        setServerError('');

        if (!formData.username || !formData.email || !formData.password) {
            setServerError('All fields are required');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.email === formData.email);

        if (userExists) {
            setServerError('User with this email already exists');
            return;
        }

        const usernameExists = users.some(user => user.username === formData.username);

        if (usernameExists) {
            setServerError('Username already taken');
            return;
        }

        const newUser = { ...formData, id: uuidv4() };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        localStorage.setItem('user', JSON.stringify({ ...formData, id: uuidv4() }));
        setUser(newUser)
        navigate('/');
    }, [setServerError, navigate, setUser]);


    const handleFacebookResponse = (response) => {
        console.log(response);
        // if (response.accessToken) {
        //     if (!response.email) {
        //         setServerError("Facebook account did not provide an email. Please use another sign up method.");
        //         return;
        //     }
        //     const users = JSON.parse(localStorage.getItem("users")) || [];
        //     let user = users.find(u => u.email === response.email);

        //     if (!user) {
        //         user = {
        //             id: uuidv4(),
        //             name: response.name,
        //             email: response.email,
        //             facebookId: response.id,
        //             accessToken: response.accessToken
        //         };
        //         users.push(user);
        //         localStorage.setItem("users", JSON.stringify(users));
        //     }

        //     sessionStorage.setItem("user", JSON.stringify(user));
        //     setUser(user);
        //     navigate('/');
        // } else {
        //     setServerError("Facebook login failed");
        // }
    };

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
                let user = users.find((u) => u.email === profile.email);

                if (user) {
                    setServerError("User with this email already exists.");
                    return;
                }

                user = {
                    id: uuidv4(),
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
                        <h2>Sign Up</h2>
                        <p>Enter your credentials to create an account</p>
                    </div>
                    <div className={`row flex-direction-column ${Style.processes}`}>
                        <FormContainer onSubmit={handleSignup} serverError={serverError} initialData={null} type="Sign Up">
                            <SignupForm />
                            {/* <div className='row width-100'>
                                <div className={`row ${Style['remember-me']}`}>
                                    <input type='checkbox' />
                                    <p>Remember me</p>
                                </div>
                            </div> */}
                        </FormContainer>

                        <p className={Style['auth-divider']}>or</p>


                        <div className={`row flex-direction-column width-100 ${Style['auth-external']}`}>
                            <button className={`row justify-content-center`} onClick={signup}>
                                <RiGoogleFill size={16} color='#333' />
                                Continue with Google
                            </button>
                            <FacebookLogin
                                appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                                autoLoad={false}
                                fields="name,email,picture"
                                callback={handleFacebookResponse}
                                textButton="Continue with Facebook"
                            />
                            {/* <FacebookProvider appId={FACEBOOK_KEY} >
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
                        </div>

                        <p className={`row ${Style['navigate-other-auth']}`}>
                            Already have an account?
                            <Link to={'/auth/login'}>Sign In Now!</Link>
                        </p>

                    </div>
                </div>
            </div>
        </section>
    );
}
export default Signup;