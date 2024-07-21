import styles from "./Header.module.css";
import BackArrow from "../../assets/backArrow@.png";
import menu from "../../assets/menu.png";
import { useNavigate,useLocation } from "react-router-dom";
import { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { clearUser } from "../../Slices/authSlice";
const Header = ({ text,redirect }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

    const location = useLocation();

    if(location.pathname === "/"){
      return(
        <div className={styles.header2}>
          <h2>SalonDekho</h2>
           <img src={menu} alt="" onClick={toggleMenu}  />
           <SlidingWindow isOpen={isMenuOpen} onClose={toggleMenu} />
        </div>
      )
    }
  return (
    <div className={styles.header}>
      <img
        src={BackArrow}
        alt=""
        onClick={() => {
            navigate(-1);
        }}
      />
      <h2>{text}</h2>
      <img src={menu} alt="" onClick={toggleMenu}  />
      <SlidingWindow isOpen={isMenuOpen} onClose={toggleMenu} />
    </div>
  );
};


const SlidingWindow = ({isOpen,onClose}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.auth);
  return(
    <div className={`${styles.slidingMenu} ${isOpen ? styles.open : ""}`}>
    <div className={styles.menuContent}>
      <div >
    <img
        src={BackArrow}
        alt=""
        onClick={onClose}
        />
      <h2>Settings</h2>
      <p></p>
        </div>
{user ? (
      <ul>
        <li onClick={()=>{
          navigate("/profile");
        }}>
          <p>
          Profile
          </p>
          <img src={BackArrow} alt="" />
        </li>
        <div>
        <li onClick={()=>{
          navigate("/history");
        }}>
          <p>
          Booking History
          </p>
          <img src={BackArrow} alt="" />
          </li>
        </div>
        <div>
        <li onClick={()=>{
          dispatch(clearUser());
        }}>
          <p>
          Logout
          </p>
          <img src={BackArrow} alt="" />
          </li>
          </div>
          <a href="https://play.google.com/store/apps/details?id=com.salondekho.salon" target="_blank">
          <li>
            <p>
            For Business
            </p>
            <img src={BackArrow} alt="" />
          </li>
          </a>
      </ul> ) : (
        <ul>
          <div>
          <li onClick={()=>{
            navigate("/login-otp");
          }}>
            <p>
            Login
            </p>
            <img src={BackArrow} alt="" />
          </li>
            </div>
          <a href="https://play.google.com/store/apps/details?id=com.salondekho.salon" target="_blank">
          <li>
            <p>
            For Business
            </p>
            <img src={BackArrow} alt="" />
          </li>
          </a>
        </ul>
      )}
    </div>
  </div>
  )
}





export default Header;
