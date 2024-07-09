import { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import styles from "./Timeslot.module.css";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { setAppointment } from "../../Slices/appointmentSlice";
import Loader from "../../Components/Loader/Loader";

const Timeslot = () => {
  const { state } = useLocation();
  const { salonid } = useParams();
  const service = useSelector((state) => state.services.Services);
  const artist = useSelector((state) => state.artist.artist);
  const user = useSelector((state) => state.auth.auth);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const [timeSlots, setTimeSlots] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [duration, setDuration] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const services = service?.map((service) => service.id);

  //get current date and time

  const date = new Date();
  const currentdate = moment(date).format("YYYY-MM-DD");
  const currenttime = moment(date).format("HH:mm");

  useEffect(() => {
    setLoading(true);
    fetch("https://api.salondekho.in/api/appointment/getTimeSlots", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        services,
        artistId: artist,
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

  const createAppointment = () => {
    dispatch(
      setAppointment({
        artistId: artist,
        services,
        appointmentDate: selectedDate,
        appointmentStartTime: selectedTime,
        duration,
      })
    );

    if (!user) {
      Navigate("/login");
    } else {
      Navigate(`/bookAppointment/${salonid}`);
    }
  };



  return (
    <div className={styles.main}>
      <div>
        <Header text={"Choose your time"} />
        <h2 className={styles.artistName}>{state?.artist?.ArtistName}</h2>
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
      { selectedTime && selectedDate && (
      <button
        className={styles.continue}
        onClick={() => {
          createAppointment();
        }}
      >
        Continue
      </button>
      )}
    </div>
  );
};

export default Timeslot;
