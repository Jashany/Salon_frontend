import React, { useEffect } from "react";
import styles from "./Login.module.css";
import { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import backArrow from "../../assets/backArrow@.png";
import { useSelector } from "react-redux";
const Login = () => {

  const query = new URLSearchParams(useLocation().search);
  const redirect = query.get("redirect");
  const navigate = useNavigate();
  const [phoneNumber, setPhone] = useState("");
  const user = useSelector((state) => state.auth.auth);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  const handlesubmit = () => {
    fetch("https://api.salondekho.in/api/auth/send-otp", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber,
        role: "Customer",
      })
    }).then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          if(redirect){
            navigate(`/verify-otp?phoneNumber=${phoneNumber}&redirect=${redirect}`);
          }else{
            navigate(`/verify-otp?phoneNumber=${phoneNumber}`);
          }
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
            onChange={(e) => setPhone(e.target.value)}
            maxLength="10"
          />
        </label>
        <p style={{
          fontSize: "0.8rem",
          textAlign: "center",
          marginTop: "10px",
          color: "#777",
        }}>
          By continuing, you agree to our {''}
          <a href="https://terms.salondekho.in/" target="_blank" style={{
            color: "#000",
            textDecoration: "underline",
          }}>
           Terms of Service 
          </a>
          {' '}and {''}
          <a href="https://privacy-policy.salondekho.in" target="_blank" style={{
            color: "#000",
            textDecoration: "underline",
          }}>
          Privacy Policy
          </a>
        </p>
        <button onClick={handlesubmit}>Get OTP</button>
      </div>
    </div>
  );
};

export default Login;
