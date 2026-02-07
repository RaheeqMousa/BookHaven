import PropTypes from 'prop-types';

function LoginForm(props) {
    const { register, errors } = props;
    return (
        <div className={`row flex-direction-column controls`}>
            <div className={`row justify-content-center flex-direction-column align-start width-100 field`}>
                <label htmlFor="email">Email Address</label>
                <input id="email" type='email' name="email" placeholder='Enter your email' {...register("email", { required: 'Email is required' })} />
            </div>
            <p className="error">{errors.email ? errors.email.message : ''}</p>
            <div className={`row justify-content-center flex-direction-column align-start width-100 field`}>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" placeholder='Enter your password' {...register("password", { required: 'Password is required' })} />
            </div>
            <p className="error">{errors.password ? errors.password.message : ''}</p>
        </div>
    );
}
export default LoginForm;

LoginForm.propTypes = {
    register: PropTypes.func.isRequired,
    errors: PropTypes.object
};