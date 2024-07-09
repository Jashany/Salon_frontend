import SalonCard from "./Components/SalonCard";
import Styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearArtist } from "../../Slices/artistSlice";
import { clearServices } from "../../Slices/servicesSlice";
import { clearAppointment } from "../../Slices/appointmentSlice";
import Header from "../../Components/Header/Header";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";

const API_KEY = "AIzaSyAdINc7vU6-hFW61ZsERj0tSQIcqGYPb4Y";
console.warn = () => {};
const Home = () => {
  const [salons, setSalons] = useState([]);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [salon, setSalon] = useState("");
  const [address, setAddress] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getLocation = () => {
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
  };

  useEffect(() => {
    dispatch(clearArtist());
    dispatch(clearServices());
    dispatch(clearAppointment());
    if (!sessionStorage.getItem("location")) {
      getLocation();
    } else {
      setLocation(JSON.parse(sessionStorage.getItem("location")));
    }
  }, [dispatch]);

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
          if(data.success == true) {
          setSalons(data?.data);
          } else {
            setSalons([]);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [location]);

  const handleSelect = async (value) => {
    const results = await geocodeByPlaceId(value.value.place_id);
    const lat = results[0].geometry.location.lat();
    const lng = results[0].geometry.location.lng();
    setAddress([lat, lng, value.label]);
    console.log(value.label);
    console.log(lat, lng);
  };

  const SearchFunction = () => {
    const params = new URLSearchParams();
    if (salon) {
      params.append("salon", salon);
    }
    if (address[0] && address[1]) {
      params.append("long", address[1]);
      params.append("lat", address[0]);
      params.append("address", address[2]);
    }

    if (salon || (address[0] && address[1]) || (location.latitude !== 0 && location.longitude !== 0)) {
      navigate(`/search?${params.toString()}`);
    } else {
      getLocation();
    }
  };

  return (
    <div className={Styles.main}>
      <Header text="Home" />
      <h1>Salon Dekho</h1>
      <div className={Styles.search}>
        <label>
          Search Your Salon
          <input
            type="text"
            placeholder="Search Anything"
            name="Salon"
            onChange={(e) => setSalon(e.target.value)}
          />
        </label>
        <label
          style={{
            gap: "10px",
          }}
        >
          Location
          <GooglePlacesAutocomplete
            apiKey={API_KEY}
            autocompletionRequest={{
              componentRestrictions: {
                country: ["in"],
              },
            }}
            selectProps={{
              address,
              onChange: handleSelect,
            }}
            debounce={1000}
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
}

export default Home;