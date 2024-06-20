import React, { useEffect, useState } from "react";
import styles from "./otpless.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { user as setUser } from "../../Slices/authSlice";

const OTP = () => {
  const [gender, setGender] = useState("");
  const [Name, setName] = useState("");
  const [newUser, setNewUser] = useState(false);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const user = useSelector((state) => state.auth.auth);

  useEffect(() => {
    if (user) {
      Navigate("/");
    }
    const script = document.createElement("script");
    script.id = "otpless-sdk";
    script.type = "text/javascript";
    script.src = "https://otpless.com/v2/auth.js";
    script.setAttribute("data-appid", "GUV51XISATNSJJGV13Q4");
    document.head.appendChild(script);

    window.otpless = (otplessUser) => {
      setUserInfo(otplessUser);
    };
  }, []);

  useEffect(() => {
    if (userInfo) {
      fetch("https://api.salondekho.in/api/auth/verifyToken", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: userInfo.token,
          role: "Customer",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success == true) {
            dispatch(setUser(data.user));
            if (data.user.isNewUser == true) {
              setNewUser(true);
            } else {
              Navigate(-1);
            }
          }
        });
    }
  }, [userInfo]);

  if (newUser) {
    const element = document.getElementById("otpless-login-page-frame");
    if (element) {
      element.style.display = "none";
    }
  }

  return (
    <div className={styles.main} id="main">
      {newUser ? (
        <div
          style={{
            width: "100vw",
            position: "absolute",
            top: "0",
            zIndex: "1000",
            height: "100vh",
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
                  value={Name}
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

              <button
                onClick={() => {
                  fetch("https://api.salondekho.in/api/auth/updateUser", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      name: Name,
                      gender,
                    }),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      console.log(data);
                      if (data.success) {
                        console.log(data?.data);
                        dispatch(setUser(data?.data));
                        Navigate(-1);
                      }
                    });
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div id="otpless-login-page" className={styles.otp}></div>
      )}
    </div>
  );
};

export default OTP;
