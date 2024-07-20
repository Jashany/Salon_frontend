import React, { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { user as setUser } from "../../Slices/authSlice";
import styles from "./Details.module.css";
import { useNavigate,useLocation } from "react-router-dom";

const Details = () => {
    const query = new URLSearchParams(useLocation().search);
    const redirect = query.get("redirect");
    const [Name, setName] = useState("");
    const [gender, setGender] = useState("");
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const user = useSelector((state) => state.auth.auth);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setGender(user.gender)
        }
    }, []);

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
                        if (redirect) {
                            Navigate(redirect);
                        } else {
                            Navigate("/");
                        }
                    }
                  });
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
     );
}
 
export default Details;