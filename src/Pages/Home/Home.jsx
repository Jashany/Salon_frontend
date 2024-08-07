import SalonCard from "./Components/SalonCard";
import Styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect,useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearArtist } from "../../Slices/artistSlice";
import { clearServices } from "../../Slices/servicesSlice";
import { clearAppointment } from "../../Slices/appointmentSlice";
import Header from "../../Components/Header/Header";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";
import PastSalonCard from "../../Components/PastCards/PastSalonCard";

const API_KEY = "AIzaSyAdINc7vU6-hFW61ZsERj0tSQIcqGYPb4Y";
const DEFAULT_LOCATION = { latitude: 29.1672, longitude: 75.6439 };

console.warn = () => {};
const Home = () => {
  const [salons, setSalons] = useState([]);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [salon, setSalon] = useState("");
  const [value, setValue] = useState("");

  const [pastSalon, setPastSalon] = useState([]);
  const [address, setAddress] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState([]);


  const user = useSelector((state) => state.auth.auth);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
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
        },
        (error) => {
          console.log("Location permission denied, using default location");
          setLocation(DEFAULT_LOCATION);
        }
      );
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
          if (data.success == true) {
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

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const debounceSearch = useCallback(
    debounce((query) => {
      if (query.trim() === "") {
        setSearchResults([]);
        return;
      }
      fetch("https://api.salondekho.in/api/salon/searchSalons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          salonName :query }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success === true) {
            setSearchResults(data.data);
          } else {
            setSearchResults([]);
          }
        })
        .catch((error) => console.log(error));
    }, 300),
    []);

    const handleSearchChange = (e) => {
      const value = e.target.value;
  
      if(value.length <= 1){
        setSearchResults([]);
      }
  
      setValue(value);
      if (value.trim()) {
        debounceSearch(value);
      } else {
        setSearchResults([]);
      }
      console.log(searchResults)
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

    if (
      salon ||
      (address[0] && address[1]) ||
      (location.latitude !== 0 && location.longitude !== 0)
    ) {
      navigate(`/search?${params.toString()}`);
    } else {
      getLocation();
    }
  };

  return (
    <div className={Styles.main}>
      <Header text="Home" />
      <h1>Book appointments online</h1>
      <div className={Styles.search}>
        <label style={
          {
            position: "relative",
          }
        }>
          Search Your Salon
          <input
            type="text"
            placeholder="Enter Salon Name"
            name="Salon"
            onChange={handleSearchChange}
          />
          <div className={Styles.searchresultdiv}>
          {(value.length == 0 || searchResults.length === 0) ? null : (
            <div className={Styles.searchResults}>
              {searchResults.map((result, index) => (
                <h4 onClick={()=>{
                  navigate(`/salon/${result._id}`)
                }}>
                  {result.SalonName}
                </h4>
              ))}
            </div>
          )}
        </div>
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
            debounce={200}
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
