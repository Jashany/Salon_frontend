import { useEffect, useState } from "react";
import BackArrow from "../../assets/backArrow@.png";
import styles from "./Profile.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [button, setButton] = useState(false);
  


  const user = useSelector((state) => state.auth.auth);

  // useEffect(() => {
  //     if (!user) {
  //         navigate("/login");
  //     }
  // }, [user, navigate]);

  return (
    <div className={styles.main}>
      <div>
        <div className={styles.header}>
          <img src={BackArrow} alt="" onClick={()=>{
            navigate(-1);
          }} />
          <h2>Profile</h2>
          <p style={{
            visibility: "hidden"
          }}>pld</p>
        </div>
        <div className={styles.profile}>
          <label>
            <p>Name</p>
            <input
              type="text"
              placeholder={user?.name}
              value={user?.name}
              onChange={handleOnChange}
            />
          </label>
          <label>
            <p>Phone number</p>
            <input
              type="tel"
              placeholder={user?.phoneNumber}
              value={user?.phoneNumber}
              onChange={handleOnChange}
            />
          </label>
        </div>
      </div>
      <div className={styles.buttonDiv}>
        <button className={button ? styles.button : styles.disabled}>
          Update
        </button>
      </div>
    </div>
  );
};

export default Profile;
