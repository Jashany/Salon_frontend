import styles from "./History.module.css";
import BackArrow from "../../assets/backArrow@.png";
import { useEffect, useState } from "react";
import stargold from "../../assets/stargold.svg";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../../Components/Loader/Loader";
import noAppointments from "../../assets/new.png";
import { ConvertTime, MinuteToHours } from "../../Functions/ConvertTime";
import star from "../../assets/star.png";
import { useDispatch } from "react-redux";
import { clearUser } from "../../Slices/authSlice";
import { toast } from "react-toastify";
const History = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const redirected = query.get("redirected");
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    setLoading(true);
    fetch("https://api.salondekho.in/api/appointment/getAppointments", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.logout){
          dispatch(clearUser());
          navigate("/");
          toast.error("Session expired. Please login again");
        }
        setAppointments(data?.data);
        console.log(data)
        setTimeout(() => {
          setLoading(false);
        }, 500);
      })
      .catch((err) => console.log(err));
  }, []);

  if (loading) {
    return <Loader />;
  }
  console.log(appointments);
  const currentBookings = appointments?.filter(
    (appointment) => appointment.Status === "Booked"
  );

  const pastBookings = appointments?.filter(
    (appointment) => appointment.Status === "Completed"
  );

  const cancelledBookings = appointments?.filter(
    (appointment) => appointment.Status === "Cancelled"
  );

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <img
          src={BackArrow}
          alt=""
          onClick={() => {
            if(redirected){
              navigate("/");
            }else{
            navigate(-1);
            }
          }}
        />
        <h2>Booking History</h2>
        <p
          style={{
            visibility: "hidden",
          }}
        >
          pld
        </p>
      </div>
      <div className={styles.currentBooking}>
        <h3>Current Bookings</h3>
        <div className={styles.currentBookingList}>
          {currentBookings?.length > 0 ? (
            currentBookings?.map((booking) => (
              <CurrentBooking key={booking.id} currentBooking={booking} />
            ))
          ) : (
            <div className={styles.noAppointments}>
              <img src={noAppointments} alt="" />
              <h3>No current bookings</h3>
            </div>
          )}
        </div>
      </div>
      <div className={styles.pastBooking}>
        <h3>Past Bookings</h3>

        {pastBookings?.length == 0 && cancelledBookings?.length == 0 ? (
         <div className={styles.noAppointments}>
         <img src={noAppointments} alt="" />
         <h3>No past bookings</h3>
       </div>
        ) : (
           <>
            <div className={styles.pastBookingList}>
              {pastBookings?.map((booking) => (
                <PastBooking key={booking.id} pastBooking={booking} />
              ))}
            </div>
            <div className={styles.pastcancelledList}>
              {cancelledBookings?.map((booking) => (
                <CancelledBooking cancelledBooking={booking} />
              ))}
            </div>
          </> 
        )}
      </div>
    </div>
  );
};

const CurrentBooking = ({ currentBooking }) => {
  const navigate = useNavigate();
  //07 May 2024
  const date = new Date(currentBooking?.appointmentDate)
    .toDateString()
    .split(" ");
  const formattedDate = `${date[2]} ${date[1]} `;
  //time in 24 hour hh mm
  const hours = currentBooking?.appointmentStartTime.split("T")[1].split(":")[0];
  const minutes = currentBooking?.appointmentStartTime.split("T")[1].split(":")[1];
  const time = `${hours}:${minutes}`;
  console.log(time);
  const averageRating = currentBooking?.salon?.Reviews.reduce(
    (total, review) => total + review.Rating,
    0
  ) / currentBooking?.salon?.Reviews.length || 0;

  return (
    <div
      className={styles.currentcard}
      onClick={() => {
        navigate(`/appointment/${currentBooking?._id}`, { replace: true });
      }}
    >
      <div>
        {currentBooking?.salon?.CoverImage ? (
          <div
          style={{
            backgroundImage: `url(${currentBooking?.salon?.CoverImage})`,
            height: "60px",
            width: "60px",
            backgroundSize: "contain",
            backgroundPosition: "center",
            borderRadius: "50%",
            backgroundRepeat: "no-repeat",
          }}
          ></div>
        ) : (
          <div style={{
            height: "60px",
            width: "60px",
            overflow: 'hidden',
            borderRadius: '50%',
            position: 'relative',
            backgroundColor: 'black',
            color:"white",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
          
        }}>
        <h4 style={{
            fontWeight:"500",
            fontSize:"0.5rem",
              fontFamily:"Bodoni"
        }}>{currentBooking?.salon?.SalonName}</h4>
        </div>
          )}
          <div style={{display:"flex",justifyContent:"space-between",flex:1}} >
          <div>
              <h4>{currentBooking?.salon?.SalonName}</h4>
              {averageRating > 0 && (
                <div style={{display:"flex",alignItems:"center"}}>
                <p>{averageRating.toFixed(1)}</p>
                <img style={{
                  height:"12.5px",
                  marginLeft:"3px",
                  width:"12.5px",
                  marginTop:"3.5px"
                }} src={stargold} alt="" />
                </div>

              )}
            <p>{currentBooking?.salon?.address?.City}</p>
          </div>
          <div>
            <div className={styles.status}>{currentBooking?.Status}</div>
            <p style={{textAlign:"right"}}>{formattedDate}</p>
            <p style={{textAlign:"right"}}>{ConvertTime(time)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PastBooking = ({ pastBooking }) => {

  const date = new Date(pastBooking?.appointmentDate)
  .toDateString()
  .split(" ");
  const formattedDate = `${date[2]} ${date[1]} `;
  const navigate = useNavigate();

  if (pastBooking?.Review) {
    const ratingStars = [];

    for (let i = 0; i < 5; i++) {
      if (i < pastBooking?.Review?.Rating) {
        ratingStars.push(<img src={stargold} className={styles.star} alt="" />);
      } else {
        ratingStars.push(<img src={star} className={styles.star2} alt="" />);
      }
    }

    return (
      <div className={styles.pastMain}>
        <div>
          <h3>{pastBooking?.salon?.SalonName}</h3>
          <p>{pastBooking?.salon?.address?.City}</p>
          <div>{ratingStars}</div>
        </div>
        <div>
        <div className={styles.status2}>{pastBooking?.Status}</div>
        <p>
          {formattedDate}
        </p>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={styles.pastMain}
        onClick={() => {
          navigate(
            `/review/${pastBooking?._id}`,
            { state: { salon: pastBooking } },
            { replace: true }
          );
        }}
      >
        <div>
          <h3>{pastBooking?.salon?.SalonName}</h3>
          <p>{pastBooking?.salon?.address?.City}</p>
          <div>
            {[...Array(5)].map((_, index) => (
              <img src={star} className={styles.star2} alt="" />
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "10px",
            alignItems: "flex-end",
          }}
        >
          <div className={styles.status2}>{pastBooking?.Status}</div>
          <p>Rate your experience</p>
        </div>
      </div>
    );
  }
};

const CancelledBooking = ({ cancelledBooking }) => {
  return (
    <div className={styles.pastMain}>
      <div>
        <h3>{cancelledBooking?.salon?.SalonName}</h3>
        <p>{cancelledBooking?.salon?.address?.City}</p>
      </div>
      <div className={styles.status3}>{cancelledBooking?.Status}</div>
    </div>
  );
};

export default History;
