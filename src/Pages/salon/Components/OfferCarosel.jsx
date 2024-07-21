import React, { useState ,useEffect} from "react";
import styles from "./Offer.module.css";  // Adjust the import according to your project structure
import Ticket from "../../../Components/ticket/Ticket";

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
  
    return (
      <div className={styles.carousel} >
        <div className={styles.offer} onClick={()=>{
          setShowCancelModal(true)
        }} >
          <h3><span style={{
              fontWeight: 'bold',
              padding: '0.2rem',
              borderRadius: '0.5rem',
              color: '#047a04',
              marginRight: '0.5rem',
            }}>OFFER :</span>
            Get {salon.offers[currentOfferIndex].OfferDiscountinPercentage}% off via SalonDekho
          </h3>
          <p>
          {currentOfferIndex + 1}/{salon.offers.length}
          </p>
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