import React, { useEffect, useState } from "react";
import styles from "./ArtistPage.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ArtistCard from "./ArtistCard/ArtistCard";
import Header from "../../Components/Header/Header";
import Loader from "../../Components/Loader/Loader";
import { setArtist } from "../../Slices/artistSlice";

const ArtistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const services = useSelector((state) => state.services.Services);
  const { salonid } = useParams();
  const state = useLocation();
console.log(state.state)

  // Convert the array of service objects to an array of IDs
  const serviceIds = services.map((service) => service.id);

  const servicedata = state.state.serviceData || state.state

  useEffect(() => {
    if (services.length === 0) {
      navigate("/");
    }
  }, [services, navigate]);

  useEffect(() => {
    setLoading(true);
    if (serviceIds.length > 0) {
      fetch(
        `https://api.salondekho.in/api/artist/get-artist-by-service/${salonid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ serviceIds }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setArtists(data.artists);
          setTimeout(() => {
            setLoading(false);
          }, 500);
        })
        .catch((error) => {
          setTimeout(() => {
            setLoading(false);
          }, 500);
          console.error("Error fetching artists:", error);
        });
    }
  }, []);

  if (loading) {
    return (
      <>
        <Header text={"Artists"} />
        <Loader />
      </>
    );
  }

  

  return (
    <div className={styles.main}>
      <Header text={"Artists"} redirect={`/salon/${salonid}`}/>
      {artists.length == 0 ? (
          <>
          <h5 style={{
            textAlign: "center",
            marginTop: "1rem",
          }}>
          Try to book seperately each service OR reduce some services
          </h5>
          </>
      ):(
        <div className={styles.artistsList}>
        {artists.map((artist) => (
          <ArtistCard key={artist._id} artist={artist} state={servicedata} />
        ))}
      </div>
      )}
    </div>
  );
};

export default ArtistPage;
