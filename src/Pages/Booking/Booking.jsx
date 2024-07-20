import React, { useEffect, useState } from "react";
import styles from "./Booking.module.css";
import { useSelector } from "react-redux";
import Header from "../../Components/Header/Header";
import { useParams, useNavigate } from "react-router-dom";
import SendArrow from "../../assets/SendArrow.png";
import Directions from "../../assets/Frame2.svg";
import phone from "../../assets/call-calling.png";
import calendar from "../../assets/calendar.png";
import stargold from "../../assets/stargold.svg";
import clock from "../../assets/clock.png";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader/Loader";
import moment from "moment";

const Booking = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.auth);
  

  const [loading, setLoading] = useState(true);

  const [coupon, setCoupon] = useState("");
  const [offer, setOffer] = useState("");

  const [data, setData] = useState({});
  const [discount, setDiscount] = useState(0);
  const { salonid } = useParams();
  const service = useSelector((state) => state.services.Services);
  const artist = useSelector((state) => state.artist.artist);
  const services = service?.map((service) => service.id);
  const appointment = useSelector((state) => state.appointment.appointment);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (!user) {
      window.location.href = "/";
    }
    
    setLoading(true);

    fetch("https://api.salondekho.in/api/appointment/getCost", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        salonid,
        services,
        artistId: artist,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data?.data);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      })
      .catch((error) => {
        console.error("Error fetching timeslots:", error);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      });
  }, []);

  if (loading) {
    return (
      <>
        <Header text={"Review and Confirm"} />
        <Loader />
      </>
    );
  }

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${data?.salon?.location?.coordinates[0]},${data?.salon?.location?.coordinates[1]}`;

  //2024-06-17 get day of week
  const date = new Date(appointment.appointmentDate);
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
  const appointmentStartTime = new Date(
    appointment.appointmentDate + "T" + appointment.appointmentStartTime
  );
  const duration = appointment.duration;
  const appointmentEndTime = new Date(appointmentStartTime);
  appointmentEndTime.setMinutes(appointmentStartTime.getMinutes() + duration);
  const hours = appointmentEndTime.getHours();
  let minutes = appointmentEndTime.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  const SubmitCoupon = () => {
    if (!coupon) {
      toast.error("Please enter a coupon code");
      return;
    }
    fetch("https://api.salondekho.in/api/offer/validate-offer", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        offerName: coupon,
        salonId: salonid,
        TodayDate: appointment.appointmentDate
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success == true) {
          toast.success(data?.message);
          setDiscount(data?.data);
          setCoupon("");
        } else {
          toast.error(data?.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const appointmentStart = `${appointment.appointmentDate}T${appointment.appointmentStartTime}:00.000`;

  const submitBooking = () => {
    // Disable the button for 3 seconds after the first click
    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 3000);

    fetch("https://api.salondekho.in/api/appointment/CreateAppointment", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user?.name,
        services: appointment.services,
        artistId: appointment.artistId,
        appointmentDate: appointment.appointmentDate,
        appointmentStartTime: appointmentStart,
        duration: appointment.duration,
        cost: data?.cost - (discount / 100) * data?.cost,
        offer,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          navigate(`/success/${data?.data}`, {
            state: {
              route: `/appointment/${data?.data}`,
              text: "Booking Confirmed",
            },
          });
        } else {
          toast.error(data?.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching timeslots:", error);
      });
  };

  const convertMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hour`;
    return `${hours} hour ${mins} min`;
  };

  const phoneNumber = `tel:${data?.salon?.salonPhoneNumber}`;

  const averageRating =
    data?.salon?.Reviews.reduce((total, review) => total + review.Rating, 0) /
      data?.salon?.Reviews.length || 0;

  return (
    <div className={styles.main}>
      <div>
        <Header text={"Review and Confirm"} redirect={`/salon/${salonid}/${appointment.artistId}`} />

        <div className={styles.salon}>
          <div>
            <div
              style={{
                backgroundImage: `url(${data?.salon?.CoverImage})`,
                height: "70px",
                width: "70px",
                backgroundSize: "cover",
                borderRadius: "50%",
              }}
            ></div>
            <div className={styles.salonDetails}>
              <h1>{data?.salon?.SalonName}</h1>
              <div>
                <img
                  src={stargold}
                  alt="star"
                  style={{
                    marginRight: "3px",
                  }}
                />
                <p>{averageRating}</p>
              </div>
              <h2>{data?.salon?.address?.City}</h2>
            </div>
          </div>
          <div className={styles.logos}>
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={Directions}
                alt="directions"
                style={{
                  borderRadius: "50%",
                }}
              />
            </a>
            <a href={phoneNumber}>
              <div
                style={{
                  borderRadius: "50%",
                  boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
                  height: "30px",
                  width: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={phone}
                  alt="phone"
                  style={{
                    height: "20px",
                    width: "20px",
                  }}
                />
              </div>
            </a>
          </div>
        </div>
        <div className={styles.dateTime}>
          <h3>
            <img src={calendar} />
            {date.getDate()} {moment(date).format("MMMM")} {dayOfWeek}
          </h3>
          <h3>
            <img src={clock} />
            {appointment.appointmentStartTime} TO {hours}:{minutes}
          </h3>
        </div>
        <div className={styles.services}>
          {data?.services?.map((service) => (
            <div key={service._id} className={styles.serviceClass}>
              <div>
                <h3>
                  {service.Service.ServiceName} -{" "}
                  {service.Service.ServiceGender}
                </h3>
                <h4>{convertMinutes(service?.Service.ServiceTime)}</h4>
              </div>
              <h3>₹{service.Price}</h3>
            </div>
          ))}
        </div>

        <div className={styles.coupon}>
          <h2>Apply Coupons</h2>
          <div>
            <input
              type="text"
              placeholder="Enter Coupon Code"
              name="coupon"
              value={coupon}
              onChange={(e) => {
                setCoupon(e.target.value);
                setOffer(e.target.value);
              }}
            />
            <button onClick={SubmitCoupon}>Apply</button>
          </div>
        </div>

        <div className={styles.payment}>
          <div>
            <h4>Pay Now</h4>
            <h4>₹{(data?.cost).toFixed(2)}</h4>
          </div>
          {discount > 0 && (
            <div>
              <h4>Discount</h4>
              <h4>₹{((discount / 100) * data?.cost).toFixed(2)}</h4>
            </div>
          )}
          <div
            style={{
              color: "green",
            }}
          >
            <h4>Total</h4>
            <h4>₹{(data?.cost - (discount / 100) * data?.cost).toFixed(2)} </h4>
          </div>
        </div>
        <div className={styles.paymentMethod}>
          <h2>Payment Method</h2>
          <div>
            <h4>Cash</h4>
          </div>
        </div>
      </div>
      <button
        className={styles.confirm}
        disabled={isButtonDisabled}
        onClick={submitBooking}
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default Booking;
