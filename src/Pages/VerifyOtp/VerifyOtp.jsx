import styles from "./VerifyOtp.module.css";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OtpInput from "react-otp-input";
const VerifyOtp = () => {
  const { state } = useLocation();

  const navigate = useNavigate();
  const [enteredOTP, setOtp] = useState("");
  const handleSubmit = () => {
    fetch("https://api.salondekho.in/api/offer/test", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };
  return (
    <div className={styles.main}>
      <div>
        <h1>Verify OTP</h1>
        <label>
          <OtpInput
            value={enteredOTP}
            containerStyle={styles.otpContainer}
            onChange={setOtp}
            numInputs={4}
            renderInput={(props) => <input {...props} />}
          />
        </label>
        <button onClick={handleSubmit}>Verify OTP</button>
        <p>
          Didn't receive the OTP? <span>Resend OTP</span>
        </p>
      </div>
    </div>
  );
};

const Details = () => {
  return <div></div>;
};

export default VerifyOtp;
