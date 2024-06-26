import React from "react";
import styles from "./Login.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import backArrow from "../../assets/backArrow@.png";
const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhone] = useState("");
  const handlesubmit = () => {
    fetch("https://api.salondekho.in/api/auth/verifyUser", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber,
        verified: true,
        role: "Customer",
      }),
    }).then((res) => {
      const jwtToken = Cookies.get("jwt");
      console.log(jwtToken);
      for (let entry of res.headers.entries()) {
        console.log("header", entry);
      }
    });
  };
  return (
    <div className={styles.main}>
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
        <button onClick={handlesubmit}>Get OTP</button>
      </div>
    </div>
  );
};

export default Login;
