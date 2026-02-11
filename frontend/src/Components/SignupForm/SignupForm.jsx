import PropTypes from 'prop-types';

function SignupForm(props){
    const {register, errors}=props;

    return(
        <div className={`row flex-direction-column controls`}>
            <div className={`row justify-content-center flex-direction-column align-start width-100 field`}>
                <label htmlFor="username">Username:</label>
                <input id="username" type='text' name="username" placeholder='Enter your username' {...register("username", {required:'username is required', minLength:{value: 3, message:"Username must be 'AT LEAST' 3 digits"}, maxLength:{value: 20, message:"Username must be 'AT MOST' 20 digits"} })}/>
            </div>
            <p className="error">{errors.username?errors.username.message:''}</p>
            <div className={`row justify-content-center flex-direction-column align-start width-100 field`}>
                <label htmlFor="email">Email Address</label>
                <input id="email" type='email' name="email" placeholder='Enter your email' {...register("email", {required:'Email is required'})}/>
            </div>
            <p className="error">{errors.email?errors.email.message:''}</p>
            <div className={`row justify-content-center flex-direction-column align-start width-100 field`}>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" placeholder='Enter your password' {...register("password", {required:'Password is required', minLength:{value: 8, message:"Password must be 'AT LEAST' 8 digits"}, maxLength:{value: 20, message:"Password must be 'AT MOST' 20 digits"} })} />
            </div>
            <p className="error">{errors.password?errors.password.message:''}</p>
        </div>
    );
}
export default SignupForm;

SignupForm.propTypes = {
    register:PropTypes.func.isRequired,
    errors: PropTypes.object
};