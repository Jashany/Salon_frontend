import React, { useEffect, useState } from "react";
import styles from "./Appointments.module.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import BackArrow from "../../assets/backArrow@.png";
import close from "../../assets/close.png";
import star from "../../assets/stargold.svg";
import calendar from "../../assets/calendar.png";
import clock from "../../assets/clock.png";
import moment from "moment";
import Loader from "../../Components/Loader/Loader";
import { ConvertTime } from "../../Functions/ConvertTime";
import { BiUser } from "react-icons/bi";
const Appointment = () => {
  const { appointmentId } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const redirect = query.get("redirected");
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const state = useLocation();
  const location = useLocation();

  //current route get

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://api.salondekho.in/api/appointment/getAppointments/${appointmentId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setAppointment(data?.data);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      })
      .catch((error) => {
        console.error("Error fetching appointment:", error);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      });
  }, [appointmentId]);

  if (loading) {
    return <Loader />;
  }

  const convertMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hour`;
    return `${hours} Hours ${mins} min`;
  };

  const date = new Date(appointment?.appointmentDate);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = days[date.getDay()];

  const startTime = appointment?.appointmentStartTime.slice(11, 16);
  const endTime = appointment?.appointmentEndTime.slice(11, 16);

  const ratingAverage =
    appointment?.salon?.Reviews.reduce(
      (acc, review) => acc + review.Rating,
      0
    ) / appointment?.salon?.Reviews.length;



  const handleCancel = () => {
    fetch(
      `https://api.salondekho.in/api/appointment/cancelAppointment/${appointmentId}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setShowCancelModal(false);
        navigate("/history?redirected=true", { replace: true });
      })
      .catch((err) => console.log(err));
  };

  const totalServiceCost = appointment?.services?.reduce(
    (acc, service) => acc + service.ServiceCost,
    0
  );
  console.log(totalServiceCost);

  const ifDiscount =  totalServiceCost - appointment?.appointmentCost;
  const discount = ifDiscount > 0 ? ifDiscount : null;


  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <img
          src={close}
          alt=""
          onClick={() => {
            if(redirect) navigate("/");
            else {
              navigate("/history", { replace: true });
            }
          }}
        />
      </div>
      <div className={styles.salon}>
        {appointment?.salon?.CoverImage ? (
          <img src={appointment?.salon?.CoverImage} alt="" />
        ) : (
          <div style={{
            width: '100%',
            height:'200px',
            overflow: 'hidden',
            borderRadius: '10px',
            position: 'relative',
            backgroundColor: 'black',
            color:"white",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
          
        }}>
        <h4 style={{
            fontWeight:"500",
            fontSize:"1.5rem",
              fontFamily:"Bodoni"
        }}>{appointment?.salon?.SalonName}</h4>
        </div>
        )}
        <div>
          <div>
            <h2>{appointment?.salon?.SalonName}</h2>
            {appointment?.salon?.Reviews.length > 0 && 
            <div>
              <p>{ratingAverage.toFixed(1)}</p>
              <img style={{
                width: "15px",
                height: "15px",
              }} src={star} alt="" />
            </div>
            }
            <p>{appointment?.salon?.address?.City}</p>
          </div>
          <div className={styles.status}>{appointment?.Status}</div>
        </div>
      </div>
      <div className={styles.dateTime}>
        <h3>
          <img src={calendar} alt="calendar icon" />
          {date.getDate()} {moment(date).format("MMMM")},{dayOfWeek}
        </h3>
        <h3>
          <img src={clock} alt="clock icon" />
          {ConvertTime(startTime)} - {ConvertTime(endTime)}
        </h3>
        <h3>
          <BiUser />
          {appointment?.artist?.ArtistName}
        </h3>
      </div>
      <div className={styles.services}>
        {appointment?.services?.map((service) => (
          <div key={service._id} className={styles.serviceClass}>
            <div>
              <h3>
                {service?.ServiceName} - {service?.ServiceGender}
              </h3>
              <h4>{convertMinutes(service?.ServiceTime)}</h4>
            </div>
            <h3>₹{service?.ServiceCost}</h3>
          </div>
        ))}
      </div>
      <div className={styles.total}>
        {discount && (
          <div>
            <h3>Discount</h3>
            <h3>-₹{discount}</h3>
          </div>
        )}
        <div style={{color:'green'}}>
        <h3>Total Cost</h3>
        <h3>₹{appointment?.appointmentCost}</h3>
        </div>
        </div>
      <div className={styles.buttons}>
        <div
          onClick={() =>
            navigate(`/reschedule/${appointmentId}`, { state: { appointment } })
          }
        >
          Reschedule <img src={BackArrow} alt="arrow icon" />
        </div>
        <div onClick={() => setShowCancelModal(true)}>
          Cancel <img src={BackArrow} alt="arrow icon" />
        </div>
      </div>
      {showCancelModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Are you Want to Cancel this Appointment?</h3>
            <button onClick={handleCancel} className={styles.cancelButton}>
              Cancel Appointment
            </button>
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

export default Appointment;
