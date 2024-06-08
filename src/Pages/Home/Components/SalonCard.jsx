import styles from './SalonCard.module.css'
import { FaLocationDot } from "react-icons/fa6";
import { Link,useNavigate } from 'react-router-dom';

const SalonCard = ({salon}) => {
    const navigate = useNavigate();
    const currentTime = new Date().getHours()
    const startTime = salon?.startTime.split(':').map(Number)[0];
    const endTime = salon?.endTime.split(':').map(Number)[0];
    const isOpen = startTime <= currentTime && endTime >= currentTime
    const distance = salon?.distance / 1000;
    console.log(distance)
    return ( 
   
        <div className={styles.salon} onClick={()=>{
            navigate(`/salon/${salon?._id}`, {state: {distance : distance} })
        }
        }>
            <img src={salon?.CoverImage} alt="salon" />
            <div className={styles.lowerContent}>
                <div>
                    <h2>{salon?.SalonName}</h2>
                    <p>⭐4.3</p>
                    <p><FaLocationDot /> {Math.ceil(distance)} kms</p> 
                </div>
                <div>
                    {isOpen ? <p className={styles.open}>Open</p> : <p className={styles.closed}>Closed</p>}
                    <h6>{salon?.Gender}</h6>
                </div>
            </div>
        </div>
    );
}
 
export default SalonCard;