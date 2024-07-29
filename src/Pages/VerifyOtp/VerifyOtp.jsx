import styles from "./VerifyOtp.module.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { user as setUser } from "../../Slices/authSlice";
import backArrow from "../../assets/backArrow@.png";


import OtpInput from "react-otp-input";
const VerifyOtp = () => {
  const dispatch = useDispatch();
  const query = new URLSearchParams(useLocation().search);
  const phoneNumber = query.get("phoneNumber");
  const redirect = query.get("redirect");
  const navigate = useNavigate();
  const [enteredOTP, setOtp] = useState("");
  const user = useSelector((state) => state.auth.auth);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
    if(!phoneNumber){
      navigate("/login-otp");
    }
  }
  , []);

  const handleSubmit = () => {
    fetch("https://api.salondekho.in/api/auth/verify-otp", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber:  phoneNumber,
        enteredOTP: enteredOTP,
        role: "Customer",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.success == true){
          dispatch(setUser(data.user));
          if(!data?.user?.name || !data?.user?.gender){
            if(redirect){
            navigate(`/details?redirect=${redirect}`, { state: { phoneNumber: phoneNumber } });
            }else{
              navigate("/details", { state: { phoneNumber: phoneNumber } });
            }
          }else{
            navigate(redirect ? redirect : "/");
          }
        }
      });
  };
  return (
    <div className={styles.main}>
      <div className={styles.back} onClick={() => navigate(-1)}>
        <img src={backArrow} alt="back" />
      </div>
      <div>
        <h1>Verify OTP</h1>
        <label>
          <OtpInput
            value={enteredOTP}
            containerStyle={styles.otpContainer}
            onChange={setOtp}
            inputType="number"
            numInputs={4}
            isInputNum={true}
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
