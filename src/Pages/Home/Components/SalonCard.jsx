import styles from './SalonCard.module.css'
import { FaLocationDot } from "react-icons/fa6";
import { Link,useNavigate } from 'react-router-dom';
import stargold from '../../../assets/stargold.svg'
import insta from '../../../assets/insta.webp'

const SalonCard = ({salon}) => {
    const navigate = useNavigate();
    const currentTime = new Date().getHours()
    const startTime = salon?.startTime.split(':').map(Number)[0];
    const endTime = salon?.endTime.split(':').map(Number)[0];
    const isOpen = startTime <= currentTime && endTime >= currentTime

    const distance = salon?.distance / 1000;
    
    const MaxOffer = salon?.offers.reduce((max,offer) => offer.OfferDiscountinPercentage > max ? offer.OfferDiscountinPercentage : max, 0)

    const averageRating = salon?.Reviews.reduce((total, review) => total + review.Rating, 0) / salon?.Reviews.length || 0

    const rating = averageRating % 1 === 0 ? averageRating : averageRating.toFixed(1)


    return ( 
   
        <div className={styles.salon} onClick={()=>{
            navigate(`/salon/${salon?._id}`, {state: {distance : distance} })
        }
        }>  
            <div style={{
                width: '100%',
                height:'200px',
                overflow: 'hidden',
                borderRadius: '10px',
                position: 'relative',
                background: 'linear-gradient(to top, #00000056, transparent)',
            }}>
            <img src={salon?.CoverImage} alt={salon?.SalonName} />
            {MaxOffer > 0 && <p className={styles.offer}>{MaxOffer}% OFF</p>}
            </div>
            <div className={styles.lowerContent}>
                <div>
                    <h2>{salon?.SalonName}</h2>
                    {rating==0 ? null :
                    <div className={styles.rating}>
                    <p>{rating}</p>
                    <img src={stargold} alt="rating" />
                    </div>
                    }
                    <p><FaLocationDot />{salon?.address?.City} <p>
                        {salon.distance && 
                        <p>
                            {Math.ceil(distance)} kms
                        </p>
                        } 
                        </p> </p>
                        
                </div>
                <div>
                    {/* {isOpen ? <p className={styles.open}>Open</p> : <p className={styles.closed}>Closed</p>} */}
                   {salon?.Instagram ? <a href={salon?.Instagram} target="_blank" rel="noreferrer">
                    <img className={styles.insta} src={insta} alt="" />
                   </a> : 
                   <div className={styles.empty}> </div>
                   }
                    <h6 style={{justifySelf:"flex-end"}}>{salon?.Gender}</h6>
                </div>
            </div>
        </div>
    );
}
 
export default SalonCard;