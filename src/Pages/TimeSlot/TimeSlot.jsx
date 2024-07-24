import { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import styles from "./Timeslot.module.css";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams,useLocation } from "react-router-dom";
import { setAppointment } from "../../Slices/appointmentSlice";
import Loader from "../../Components/Loader/Loader";
import { ConvertTime } from "../../Functions/ConvertTime";
import { MinuteToHours } from "../../Functions/ConvertTime";

const Timeslot = () => {
  const Artist = sessionStorage.getItem("artist");
  const jsonArtist = JSON.parse(Artist);
  const {state} = useLocation();
  console.log(state)
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

  const getDay = (date) => moment(date).format("dddd");
  const getMonthYear = (date) => moment(date).format("MMMM YYYY");

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
      Navigate(`/login-otp?redirect=/bookAppointment/${salonid}`);
    } else {
      if (!user.name || !user.gender) {
        Navigate(`/details?redirect=/bookAppointment/${salonid}`);
      }
      Navigate(`/bookAppointment/${salonid}`);
    }
  };

  const daysInMonth = moment(date).daysInMonth();
  const allDates = Array.from({ length: daysInMonth }, (_, i) =>
    moment(currentdate).add(i, "days").format("YYYY-MM-DD")
  )

  return (
    <div className={styles.main}>
      <div>
        <Header text={"Choose your time"} redirect={`/salon/${salonid}/artists`} />
        <h2 className={styles.artistName}>{jsonArtist}</h2>
        <h2 style={{fontSize:"1rem"}} >{getMonthYear(selectedDate)}</h2>
        <div className={styles.dateslots}>
          {allDates.map((date) => (
            <div
              key={date}
              className={timeSlots[date]?.length ? styles.date : styles.disabled}
              onClick={() => {
                if (timeSlots[date]?.length) {
                  setSelectedDate(date);
                }
              }}
            >
              <div className={selectedDate === date ? styles.selected : ""}>
                <h3>{date.slice(8, 10)}</h3>
              </div>
              <h5>{getDay(date).slice(0, 3)}</h5>
            </div>
          ))}
        </div>
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
                <p>{ConvertTime(time)}</p>
              </div>
            ))}
        </div>
      </div>
      {selectedTime && selectedDate && (
        <div className={styles.book}>
           <div >
          <h4 style={{fontWeight:"500"}}>₹{state.totalCost}</h4>
          <div style={{
            marginTop:"5px",
            display:"flex",
            gap:"5px",
            color:"#676767",
          }}>
            <p>
              {state.NoOfServices} Service{state.NoOfServices > 1 ? "s" : ""} • 
            </p>
            <p>
            {MinuteToHours(state.totalDuration)}
            </p>
          </div>
          </div>
          <button
            className={styles.button}
            onClick={() => {
              createAppointment();
            }}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default Timeslot;
