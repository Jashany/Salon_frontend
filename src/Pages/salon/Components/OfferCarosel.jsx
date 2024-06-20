import React, { useState ,useEffect} from "react";
import styles from "./Offer.module.css";  // Adjust the import according to your project structure


const OffersCarousel = ({ salon }) => {
    const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
    const [showDescription, setShowDescription] = useState(true);
  
    useEffect(() => {
      // Set up interval for automatic offer transition
      const offerInterval = setInterval(() => {
        setCurrentOfferIndex((prevIndex) =>
          prevIndex === salon.offers.length - 1 ? 0 : prevIndex + 1
        );
        setShowDescription(true); // Reset to show description when changing offers
      }, 3000); // Change offer every 3 seconds
  
      // Clear interval on component unmount
      return () => clearInterval(offerInterval);
    }, [salon.offers.length]);
  
    const handleToggle = () => {
      setShowDescription(!showDescription);
    };
  
    return (
      <div className={styles.carousel}>
        <div className={styles.offer} onClick={handleToggle}>
          <h3>
            {showDescription
              ? salon.offers[currentOfferIndex].OfferDescription
              : salon.offers[currentOfferIndex].OfferName}
          </h3>
          <p>
          {currentOfferIndex + 1}/{salon.offers.length}
          </p>
        </div>
      </div>
    );
  };
  
  export default OffersCarousel;