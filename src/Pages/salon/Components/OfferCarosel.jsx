import React, { useState ,useEffect} from "react";
import styles from "./Offer.module.css";  // Adjust the import according to your project structure
import Ticket from "../../../Components/ticket/Ticket";
import greater from "../../../assets/greater-than.png";

const OffersCarousel = ({ salon }) => {
    const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const handleCancel = () => {
      setShowCancelModal(false);
    };

    useEffect(() => {
      // Set up interval for automatic offer transition
      const offerInterval = setInterval(() => {
        setCurrentOfferIndex((prevIndex) =>
          prevIndex === salon.offers.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // Change offer every 3 seconds
  
      // Clear interval on component unmount
      return () => clearInterval(offerInterval);
    }, [salon.offers.length]);

    // i click on background when model is open the model should close

    const handleBackgroundClick = (e) => {
      if (e.target.classList.contains(styles.modal)) {
        setShowCancelModal(false);
      }
    };
  
    return (
      <div className={styles.carousel} >
        <div className={styles.offer} onClick={()=>{
          setShowCancelModal(true)
        }} >
          <h3><span style={{
              fontWeight: 'bold',
              borderRadius: '0.5rem',
              color: '#047a04',
              marginRight: '0.5rem',
            }}>OFFER :</span>
            Get {salon.offers[currentOfferIndex].OfferDiscountinPercentage}% off 
          </h3>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>

            {salon.offers.length > 1 && 
          <p>
             {currentOfferIndex + 1}/{salon.offers.length} 
          </p>
            }
          <img style={{
            height: '15px',
            width: '12px', 
            marginBottom: '1px' 
          }} src={greater} alt="" />
          </div>
        </div>
        {showCancelModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            {salon?.offers.map((offer, index) => (
              <>
            <div>
              <Ticket text={offer.OfferName} />
            </div>
            <h3> Get {offer.OfferDiscountinPercentage}% off via SalonDekho </h3>
            <p>
              {offer.OfferDescription}
            </p>
              </>
            ))}
            <button
              onClick={() => setShowCancelModal(false)}
              className={styles.closeButton}
            >
              +
            </button>
          </div>
        </div>
      )}
      </div>
    );
  };
  
  export default OffersCarousel;