import { useEffect, useState } from "react";
import styles from "./SearchPage.module.css";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { VscSettings } from "react-icons/vsc";
import SalonCard from "../Home/Components/SalonCard";
import { useDispatch } from "react-redux";
import { clearAppointment } from "../../Slices/appointmentSlice";
import { clearArtist } from "../../Slices/artistSlice";
import { clearServices } from "../../Slices/servicesSlice";
import Loader from "../../Components/Loader/Loader";

const SearchPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [salons, setSalons] = useState([]);
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const query = useQuery();
  const service = query.get("service");
  const address = query.get("address");

  const dispatch = useDispatch();
  dispatch(clearAppointment());
  dispatch(clearArtist());
  dispatch(clearServices());

  useEffect(() => {
    setLoading(true);

    const requestdata = {};
    if (service) {
      requestdata.service = service;
    }
    if (address) {
      requestdata.address = address;
    }
    if (!address) {
      requestdata.location = JSON.parse(sessionStorage.getItem("location"));
    }

    fetch("https://api.salondekho.in/api/salon/search-salons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestdata),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success == true) {
          setSalons(data?.data);
          setTimeout(() => {
            setLoading(false);
          }, 500);
        } else {
          setSalons([]);
          setTimeout(() => {
            setLoading(false);
          }, 500);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.main}>
      <div className={styles.filter}>
        <div className={styles.field}>
          <div className={styles.icon}>
            <IoIosArrowRoundBack onClick={() => navigate(-1)} />
          </div>
          <input type="text" id="service" value={service} readOnly disabled />
          {address && (
            <input type="text" id="address" value={address} readOnly disabled />
          )}
        </div>
        <div className={styles.buttons}>
          <button>
            <VscSettings />
          </button>
          <button>Nearest</button>
          <button>Top Rated</button>
        </div>
      </div>
      <div className={styles.salons}>
        {salons.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "40px",
            }}
          >
            {salons.map((salon) => (
              <SalonCard key={salon._id} salon={salon} />
            ))}
          </div>
        ) : (
          <h1>No Salons Found</h1>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
