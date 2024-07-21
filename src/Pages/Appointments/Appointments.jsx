import React, { useEffect, useState } from "react";
import styles from "./Appointments.module.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import BackArrow from "../../assets/backArrow@.png";
import star from "../../assets/stargold.svg";
import calendar from "../../assets/calendar.png";
import clock from "../../assets/clock.png";
import moment from "moment";
import Loader from "../../Components/Loader/Loader";

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
        navigate("/history", { replace: true });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <img
          src={BackArrow}
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
        <img src={appointment?.salon?.CoverImage} alt="" />
        <div>
          <div>
            <h2>{appointment?.salon?.SalonName}</h2>
            <div>
              <img src={star} alt="" />
              <p>{ratingAverage}</p>
            </div>
            <p>{appointment?.salon?.address?.City}</p>
          </div>
          <div className={styles.status}>{appointment?.Status}</div>
        </div>
      </div>
      <div className={styles.dateTime}>
        <h3>
          <img src={calendar} alt="calendar icon" />
          {date.getDate()} {moment(date).format("MMMM")} {dayOfWeek}
        </h3>
        <h3>
          <img src={clock} alt="clock icon" />
          {startTime} TO {endTime}
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
