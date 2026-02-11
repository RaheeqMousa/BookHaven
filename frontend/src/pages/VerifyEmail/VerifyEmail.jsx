import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../Utils/axios";
import { useContext } from "react";
import { UserContext } from "../../Context/UserContext";
import Style from '../../Styles/Auth.module.scss';
import ReadingImg from '../../assets/Images/Reading.jpg'
import { IoBookOutline } from "react-icons/io5";
import { useEffect, useRef } from "react";
import styles from "./VerifyEmail.module.scss";
import FormContainer from "../../Container/FormContainer";

function VerifyEmail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const email = state?.email;
  const remember = state?.remember;

  const [code, setCode] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(60);

  const inputsRef = useRef([]);

  // countdown timer
  useEffect(() => {
    if (seconds === 0) return;
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  if (!email) {
    navigate("/auth/login");
    return null;
  }

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) 
      return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(paste)) return;

    const newCode = paste.split("");
    setCode(newCode);
    inputsRef.current[5].focus();
  };

  const handleVerify = async () => {
    try {
        setLoading(true);
        setError("");

        const joinedCode = code.join("");

        const res = await api.post("/email_verification/verify_code", {
          email,
          code: joinedCode,
        });

        const token= res.data.access_token;
        const user = {
            username: res.data.username,
            email: res.data.email
        };

        setUser(user);
        console.log(res)

        if (remember)
          localStorage.setItem("token", token);
        else
          sessionStorage.setItem("token", token);
        setUser(user);
        navigate("/");
    } catch (err) {
        setError(err.response?.data?.message || "Invalid code");
    } finally {
        setLoading(false);
    }
  };

  const resendCode = async () => {
    await api.post("/email_verification/resend_verification_code", { email });
    setSeconds(60);
  };

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
             <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2>Verify Your Email</h2>
        <p className={styles.subtitle}>
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>

        <FormContainer
          onSubmit={handleVerify}
          serverError={error}
          type="Verify Account"
          initialData={null}
        >
          <div className={styles.codeInputs} onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (inputsRef.current[i] = el)}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
              />
            ))}
          </div>
        </FormContainer>

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={styles.verifyBtn}
          onClick={handleVerify}
          disabled={loading || code.includes("")}
        >
          {loading ? "Verifying..." : "Verify Account"}
        </button>

        <div className={styles.resend}>
          {seconds > 0 ? (
            <span>Resend code in {seconds}s</span>
          ) : (
            <button onClick={resendCode}>Resend Code</button>
          )}
        </div>
      </div>
    </div>
        </section>
  );
}

export default VerifyEmail;
