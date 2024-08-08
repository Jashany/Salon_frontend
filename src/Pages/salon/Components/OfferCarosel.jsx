import React, { useState, useEffect } from "react";
import styles from "./Offer.module.css"; // Adjust the import according to your project structure
import Ticket from "../../../Components/ticket/Ticket";
import greater from "../../../assets/greater-than.png";
const OffersCarousel = ({ salon }) => {
  console.log(salon);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  console.log(salon.offers);
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
    <div className={styles.carousel}>
      <div
        className={styles.offer}
        onClick={() => {
          setShowCancelModal(true);
        }}
      >
        <h3>
          <span
            style={{
              fontWeight: "bold",
              borderRadius: "0.5rem",
              color: "#047a04",
              marginRight: "0.5rem",
            }}
          >
            OFFER :
          </span>
          Get {salon.offers[currentOfferIndex].OfferDiscountinPercentage}% off
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {salon.offers.length > 1 && (
            <p>
              {currentOfferIndex + 1}/{salon.offers.length}
            </p>
          )}
          <img
            style={{
              height: "15px",
              width: "12px",
              marginTop: "1px",
            }}
            src={greater}
            alt=""
          />
        </div>
      </div>
      {showCancelModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            {salon?.offers.map((offer, index) => {
              const formatDate = (dateString) => {
                const date = new Date(dateString);
                const day = date.getDate();
                const month = date.toLocaleString("default", {
                  month: "short",
                });
                const year = date.getFullYear();
                const daySuffix = (day) => {
                  if (day > 3 && day < 21) return "th";
                  switch (day % 10) {
                    case 1:
                      return "st";
                    case 2:
                      return "nd";
                    case 3:
                      return "rd";
                    default:
                      return "th";
                  }
                };
                return `${day}${daySuffix(day)} ${month}`;
              };

              //array of days to a string of days

              // const days = (daysArray) => {
              //   let days = "";
              //   daysArray.map((day, index) => {
              //     days += day + ", ";
              //   });
              //   return days.slice(0, -2);
              // }

              //array of days to a string of days first 3 letters and sort them in normal order not
              const days = (daysArray) => {
                const dayOrder = [
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ];

                // Sort the daysArray based on the custom order
                const daysArraySorted = daysArray.sort((a, b) => {
                  return dayOrder.indexOf(a) - dayOrder.indexOf(b);
                });

                let days = "";
                daysArraySorted.forEach((day) => {
                  days += day.slice(0, 3) + ", ";
                });

                return days.slice(0, -2); // Remove the trailing comma and space
              };

              return (
                <>
                  <div>
                    <Ticket text={offer.OfferName} />
                  </div>
                  <h3> Get {offer.OfferDiscountinPercentage}% off </h3>
                  <p>
                    {offer.OfferDescription}
                    <br />
                    <span  style={{
                      color: "#777",
                      fontSize: "0.8rem",
                    }}>
                    Valid from {formatDate(offer?.OfferStartDate)} to{" "}
                    {formatDate(offer.OfferEndDate)}
                    </span>
                    <br />
                    <span style={{
                      color: "#777",
                      fontSize: "0.8rem",
                    }}>
                    Offer Valid on {days(offer.OfferDays)}
                    </span>
                    <br />
                  </p>
                  <p></p>
                </>
              );
            })}
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
