import SalonCard from "./Components/SalonCard";
import Styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearArtist } from "../../Slices/artistSlice";
import { clearServices } from "../../Slices/servicesSlice";
import { clearAppointment } from "../../Slices/appointmentSlice";
import Header from "../../Components/Header/Header";
const Home = () => {
  const [salons, setSalons] = useState([]);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [Service, setService] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearArtist());
    dispatch(clearServices());
    dispatch(clearAppointment());
    if (!sessionStorage.getItem("location")) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          sessionStorage.setItem(
            "location",
            JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
          );
        });
      }
    } else {
      setLocation(JSON.parse(sessionStorage.getItem("location")));
    }
  }, []);

  useEffect(() => {
    if (location.latitude !== 0 && location.longitude !== 0) {
      fetch("https://api.salondekho.in/api/salon/getSalon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setSalons(data);
        })
        .catch((error) => console.log(error));
    }
  }, [location]);

  const SearchFunction = () => {
    const params = new URLSearchParams();
    if (Service) {
      params.append("service", Service);
    }
    if (address) {
      params.append("address", address);
    }

    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className={Styles.main}>
      <Header text="Home" />
      <h1>Salon Hub</h1>
      <div className={Styles.search}>
        <label>
          Search Your Services
          <input
            type="text"
            placeholder="Search Anything"
            name="Service"
            onChange={(e) => setService(e.target.value)}
          />
        </label>
        <label>
          Location
          <input
            type="text"
            placeholder="Bandra"
            name="address"
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <button onClick={SearchFunction}>Search</button>
      </div>
      <div className={Styles.salons}>
        {salons.length === 0 ? null : <h2>Nearby Salons</h2>}
        {salons.length === 0
          ? null
          : salons?.map((salon, index) => (
              <div className={Styles.salon} key={index}>
                <SalonCard salon={salon} />
              </div>
            ))}
      </div>
    </div>
  );
};

export default Home;
