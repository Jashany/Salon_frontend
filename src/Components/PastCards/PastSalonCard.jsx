import Styles from './PastSalonCard.module.css'
import { FaLocationDot } from "react-icons/fa6";
import { Link,useNavigate } from 'react-router-dom';
import stargold from "../../assets/stargold.svg"

const PastSalonCard = ({salon}) => {
    const navigate = useNavigate();
    const currentTime = new Date().getHours()
    const startTime = salon?.startTime.split(':').map(Number)[0];
    const endTime = salon?.endTime.split(':').map(Number)[0];
    const isOpen = startTime <= currentTime && endTime >= currentTime

    const distance = salon?.distance / 1000;
    
    const MaxOffer = salon?.offers.reduce((max,offer) => offer.OfferDiscountinPercentage > max ? offer.OfferDiscountinPercentage : max, 0)

    const averageRating = salon?.Reviews.reduce((total, review) => total + review.Rating, 0) / salon?.Reviews.length || 0

    //give the rating as single digit if it whole number else to fixed 1 decimal

    const rating = averageRating % 1 === 0 ? averageRating : averageRating.toFixed(1)


    return ( 
   
        <div className={Styles.salon} onClick={()=>{
            navigate(`/salon/${salon?._id}`, {state: {distance : distance} })
        }
        }>  
            <div style={{
                width: '100%',
                height:'130px',
                overflow: 'hidden',
                borderRadius: '10px',
                position: 'relative',
            }}>
            <img src={salon?.CoverImage} alt={salon?.SalonName} />
            {MaxOffer > 0 && <p className={Styles.offer}>{MaxOffer}% OFF</p>}
            </div>
            <div className={Styles.lowerContent}>
                <div>
                    <h2>{salon?.SalonName}</h2>
                    {rating == 0 ? null :
                    <div className={Styles.rating}>
                    <img src={stargold} alt="rating" />
                    <p>{rating}</p>
                    </div>
                    }
                    <p style={{
                        fontSize: '14px'
                    }}><FaLocationDot />{salon?.address?.City} <p>
                        {salon.distance && 
                        <p>
                            {Math.ceil(distance)} kms
                        </p>
                        } 
                        </p> </p>
                        
                </div>
                <div>
                    {isOpen ? <p className={Styles.open}>Open</p> : <p className={Styles.closed}>Closed</p>}
                    <h6>{salon?.Gender}</h6>
                </div>
            </div>
        </div>
    );
}
 
export default PastSalonCard;