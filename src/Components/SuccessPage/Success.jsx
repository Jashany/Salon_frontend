import backArrow from "../../assets/backArrow@.png";
import styles from "./Success.module.css";
import { useLocation,useParams,useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearAppointment } from "../../Slices/appointmentSlice";
import { clearArtist } from "../../Slices/artistSlice";
import { clearServices } from "../../Slices/servicesSlice";
const Success = () => {
    const dispatch = useDispatch();
    dispatch(clearAppointment());
    dispatch(clearArtist());
    dispatch(clearServices());
    const navigate = useNavigate();
    const state = useLocation();
    const text = state?.state?.text;
    return ( 
        <div className={styles.main}>
            <div className={styles.header}>
                <img src={backArrow} alt="" onClick={()=>{
                    navigate('/');
                }} />
            </div>
            <div>
                <div className={styles.circle}>

                </div>
                <h1>{text}</h1>
            </div>
        </div>
     );
}
 
export default Success;