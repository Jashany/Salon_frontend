import styles from "./VerifyOtp.module.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
const VerifyOtp = ({phoneNumber}) => {
  console.log(phoneNumber)
  const navigate = useNavigate();
  const [enteredOTP, setOtp] = useState("");
  const handleSubmit = () => {
    fetch("http://localhost:5000/api/user/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber, enteredOTP }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        navigate("/details");
      });
  }
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
  return ( 
    <div>
      
    </div>
   );
}
 

export default VerifyOtp;
