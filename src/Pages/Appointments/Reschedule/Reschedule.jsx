import styles from "./Reschedule.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "../../../Components/Header/Header";
import Loader from "../../../Components/Loader/Loader";
import moment from "moment";
import Success from "../../../Components/SuccessPage/Success";

const Reschedule = () => {
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [timeSlots, setTimeSlots] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [duration, setDuration] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.auth);

  const { appointmentId } = useParams();

  const createAppointment = () => {
    fetch("https://api.salondekho.in/api/appointment/rescheduleAppointment", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointmentId: appointmentId,
        appointmentStartTime: appointmentStart,
        duration: state?.appointment?.Duration,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.success) {
          navigate(`/success/${appointmentId}`, {
            state: {
              text: "Appointment rescheduled",
            },
          });
        }
      })
      .catch((error) => {
        console.error("Error rescheduling appointment:", error);
      });
  };

  const appointmentStart = `${selectedDate}T${selectedTime}:00.000`;

  useEffect(() => {
    setLoading(true);
    fetch("https://api.salondekho.in/api/appointment/getTimeSlots", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timePeriod: state?.appointment?.Duration,
        artistId: state?.appointment?.artist,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const formatted = data?.data?.reduce((acc, slot) => {
          const date = moment.utc(slot).format("YYYY-MM-DD");

          const time = moment.utc(slot).format("HH:mm");
          if (
            date > currentdate ||
            (date === currentdate && time > currenttime)
          ) {
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(time);
          }

          return acc;
        }, {});
        setTimeSlots(formatted);
        setDuration(data?.duration);
        setSelectedDate(Object.keys(formatted)[0]);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      })
      .catch((error) => {
        setTimeout(() => {
          setLoading(false);
        }, 500);
        console.log(error);
      });
  }, []);

  if (loading) {
    return (
      <>
        <Header text={"Choose your time"} />
        <Loader />
      </>
    );
  }

  const getDay = (date) => {
    return moment(date).format("dddd");
  };

  return (
    <div className={styles.main}>
      <div>
        <Header text={"Choose your time"} />
        <div className={styles.dateslots}>
          {Object?.keys(timeSlots)?.map((date) => (
            <div
              key={date}
              className={styles.date}
              onClick={() => {
                setSelectedDate(date);
              }}
            >
              <div className={selectedDate === date ? styles.selected : ""}>
                <h3>{date.slice(8, 12)}</h3>
              </div>
              <h5>{getDay(date).slice(0, 3)}</h5>
            </div>
          ))}
        </div>
        <h4>Enter Time</h4>
        <div className={styles.timeslots}>
          {selectedDate &&
            timeSlots[selectedDate]?.map((time) => (
              <div
                key={time}
                className={
                  selectedTime === time ? styles.SelectedTime : styles.time
                }
                onClick={() => {
                  setIsButtonDisabled(false);
                  setSelectedTime(time);
                }}
              >
                <input
                  type="checkbox"
                  name="time"
                  value={time}
                  checked={selectedTime === time}
                  readOnly
                />
                <p>{time}</p>
              </div>
            ))}
        </div>
      </div>
      <button
        disabled={isButtonDisabled}
        className={styles.continue}
        onClick={() => {
          createAppointment();
        }}
      >
        Continue
      </button>
    </div>
  );
};

export default Reschedule;
