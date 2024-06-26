import styles from './SalonCard.module.css'
import { FaLocationDot } from "react-icons/fa6";
import { Link,useNavigate } from 'react-router-dom';
import stargold from '../../../assets/stargold.svg'

const SalonCard = ({salon}) => {
    const navigate = useNavigate();
    const currentTime = new Date().getHours()
    const startTime = salon?.startTime.split(':').map(Number)[0];
    const endTime = salon?.endTime.split(':').map(Number)[0];
    const isOpen = startTime <= currentTime && endTime >= currentTime
    const distance = salon?.distance / 1000;
    
    const MaxOffer = salon?.offers.reduce((max,offer) => offer.OfferDiscountinPercentage > max ? offer.OfferDiscountinPercentage : max, 0)

    const averageRating = salon?.reviews.reduce((total, review) => total + review.Rating, 0) / salon?.reviews.length || 0




    return ( 
   
        <div className={styles.salon} onClick={()=>{
            navigate(`/salon/${salon?._id}`, {state: {distance : distance} })
        }
        }>  
            <div style={{
                width: '100%',
                height:'180px',
                overflow: 'hidden',
                borderRadius: '10px',
                position: 'relative'
            }}>
            <img src={salon?.CoverImage} alt={salon?.SalonName} />
            {MaxOffer > 0 && <p className={styles.offer}>{MaxOffer}% OFF</p>}
            </div>
            <div className={styles.lowerContent}>
                <div>
                    <h2>{salon?.SalonName}</h2>
                    <div className={styles.rating}>
                    <img src={stargold} alt="rating" />
                    <p>{averageRating}</p>
                    </div>
                    <p><FaLocationDot />{salon?.address?.City} {Math.ceil(distance)} kms</p> 
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