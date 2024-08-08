import styles from "./LoginPopup.module.css";
import { atom, useAtom } from "jotai";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import backArrow from "../../assets/backArrow@.png";
import OtpInput from "react-otp-input";
import { useSelector, useDispatch } from "react-redux";
import { user as setUser } from "../../Slices/authSlice";

const loginState = atom(1);
const PhoneNumber = atom("");

const LoginPopup = ({ click }) => {
  const navigate = useNavigate();
  const [login, setLogin] = useAtom(loginState);
  const query = new URLSearchParams(useLocation().search);
  const redirect = query.get("redirect");
  const user = useSelector((state) => state.auth.auth);
  if (user && (!user.name || !user.gender)) {
    setLogin(3);
  } else if (user) {
    navigate(-1);
  }
  return (
    <div className={styles.loginPopup}>
      {login === 1 ? <SendOtp /> : login === 2 ? <VerifyOtp /> : <Details />}
    </div>
  );
};

const SendOtp = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useAtom(loginState);
  const [phoneNumber, setPhoneNumber] = useAtom(PhoneNumber);

  const sendOTP = () => {
    fetch("https://api.salondekho.in/api/auth/send-otp", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber,
        role: "Customer",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setLogin(2);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={styles.main}>
      <div className={styles.back} onClick={() => navigate(-1)}>
        <img src={backArrow} alt="back" />
      </div>
      <div>
        <h1>Log-in/Sign-up</h1>
        <label>
          Enter Phone Number
          <input
            type="number"
            placeholder="6280036528"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            maxLength="10"
          />
        </label>
        <p
          style={{
            fontSize: "0.8rem",
            textAlign: "center",
            marginTop: "10px",
            color: "#777",
          }}
        >
          By continuing, you agree to our {""}
          <a
            href="https://terms.salondekho.in/"
            target="_blank"
            style={{
              color: "#000",
              textDecoration: "underline",
            }}
          >
            Terms of Service
          </a>{" "}
          and {""}
          <a
            href="https://privacy-policy.salondekho.in"
            target="_blank"
            style={{
              color: "#000",
              textDecoration: "underline",
            }}
          >
            Privacy Policy
          </a>
        </p>
        <button onClick={sendOTP}>Get OTP</button>
      </div>
    </div>
  );
};

const VerifyOtp = () => {
  const dispatch = useDispatch();
  const [login, setLogin] = useAtom(loginState);
  const [enteredOTP, setEnteredOTP] = useState("");
  const [phoneNumber, setPhoneNumber] = useAtom(PhoneNumber);
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const query = new URLSearchParams(useLocation().search);
  const redirect = query.get("redirect");

  useEffect(() => {
    if (timeRemaining > 0) {
      const timerId = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else {
      setCanResend(true);
    }
  }, [timeRemaining]);

  const handleResendOtp = () => {
    fetch("https://api.salondekho.in/api/auth/send-otp", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber,
        role: "Customer",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCanResend(false);
          setTimeRemaining(60);
        }
      })
      .catch((err) => console.log(err));
  };

  const verifyOTP = () => {
    fetch("https://api.salondekho.in/api/auth/verify-otp", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber,
        enteredOTP: enteredOTP,
        role: "Customer",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success == true) {
          dispatch(setUser(data.user));
          if (!data.user.name || !data.user.gender) {
            setLogin(3);
          } else {
            navigate(redirect);
          }
        }
      });
  };

  return (
    <div className={styles.main2}>
      <div className={styles.back2} onClick={() => setLogin(1)}>
        <img src={backArrow} alt="back" />
      </div>
      <div>
        <h1>Verify OTP</h1>
        <label>
          <OtpInput
            value={enteredOTP}
            containerStyle={styles.otpContainer}
            onChange={setEnteredOTP}
            inputType="number"
            numInputs={4}
            isInputNum={true}
            renderInput={(props) => <input {...props} />}
          />
        </label>
        <button onClick={verifyOTP}>Verify OTP</button>
        {canResend ? (
          <p
            style={{
              cursor: "pointer",
              color: "#000",
              textDecoration: "underline",
            }}
            onClick={handleResendOtp}
          >
            Resend OTP?
          </p>
        ) : (
          <p>Time remaining: {timeRemaining} seconds</p>
        )}
      </div>
    </div>
  );
};

const Details = () => {
  const [login, setLogin] = useAtom(loginState);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.auth);
  const query = new URLSearchParams(useLocation().search);
  const redirect = query.get("redirect");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setGender(user.gender);
    }
  }, [user]);

  const submitDetails = () => {
    fetch("https://api.salondekho.in/api/auth/updateUser", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        gender,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          dispatch(setUser(data.data));
          if (redirect) {
            navigate(redirect, { replace: true });
          }
        } else {
          console.error("Error updating user details:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error updating user details:", error);
      });
  };

  return (
    <div
      style={{
        width: "100vw",
        position: "absolute",
        top: "0",
        zIndex: "1000",
        height: "100dvh",
      }}
    >
      <div className={styles.profile}>
        <h1>Enter Your Details</h1>
        <div className={styles.profilepage}>
          <label>
            Name
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <h4>Gender</h4>
          <label htmlFor="male">
            <input
              type="radio"
              id="male"
              name="gender"
              value="Male"
              onChange={(e) => setGender(e.target.value)}
            />
            Male
          </label>
          <label htmlFor="female">
            <input
              type="radio"
              id="female"
              name="gender"
              value="Female"
              onChange={(e) => setGender(e.target.value)}
            />
            Female
          </label>
          <button onClick={submitDetails}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
