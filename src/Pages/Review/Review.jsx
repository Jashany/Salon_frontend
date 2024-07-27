import { useLocation } from "react-router-dom";
import ratings from "../../assets/ratings.png";
import styles from "./Review.module.css";
import BackArrow from "../../assets/backArrow@.png";
import { useNavigate } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import { useEffect, useState } from "react";
import Loader from "../../Components/Loader/Loader";
import { useSelector } from "react-redux";

const Review = () => {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = useSelector((state) => state.auth.auth);
  console.log(state.salon.name);

  const date = new Date(state?.salon?.appointmentDate).toDateString();

  useEffect(() => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);


  if (loading) {
    return <Loader />;
  }

  const  todaysDate = new Date().toLocaleDateString()
  console.log(todaysDate)

  const submitReview = () => {
    fetch("https://api.salondekho.in/api/review/createReview", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name : state.salon.name,
        rating: rating,
        review: review,
        appointmentId: state.salon._id,
        date : todaysDate,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        navigate(-1);
      });
  };

  return (
    <div className={styles.main}>
      <div>
        <div className={styles.header}>
          <img
            src={BackArrow}
            alt=""
            onClick={() => {
              navigate(-1);
            }}
          />
          <h2>Review</h2>
          <p style={{ visibility: "hidden" }}>pld</p>
        </div>
        <img
          style={{
            width: "250px",
            objectFit: "contain",
          }}
          src={ratings}
          alt=""
         
        />
        <div className={styles.salon}>
          <h2>{state?.salon?.salon?.SalonName}</h2>
          <div>
            <p>{state?.salon?.salon?.address?.City}</p>
            <p>{date}</p>
          </div>
        </div>
        <div className={styles.review}>
          <div>
            <h3>Rating</h3>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Rating
                onClick={(rate) => {
                  setRating(rate);
                }}
                ratingValue={rating}
                stars={5}
                size={50}
                transition
                fillColor="orange"
                emptyColor="gray"
              ></Rating>
            </div>
          </div>
          <div>
            <h3>Review</h3>
            <textarea
              name="review"
              cols="30"
              rows="10"
              value={review}
              onChange={(e) => {
                setReview(e.target.value);
              }}
            ></textarea>
          </div>
        </div>
      </div>
      <button onClick={submitReview}>Post Review</button>
    </div>
  );
};

export default Review;
