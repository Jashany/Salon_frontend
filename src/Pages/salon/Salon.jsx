import { useParams } from "react-router-dom";
import styles from "./SalonPage.module.css";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import backarrow from "../../assets/BackArrow.png";
import Directions from "../../assets/Directions.png";
import SendArrow from "../../assets/SendArrow.png";
import ImageCarosel from "./Components/ImageCarosel";
import ServiceCard from "./Components/ServiceCard";
const SalonPage = () => {
  const location = useLocation();
  const [serviceType, setServiceType] = useState("All");

  const distance = location.state?.distance;
  const [salon, setSalon] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  console.log(id);
  useEffect(() => {
    fetch(`http://localhost:5001/api/salon/get/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setSalon(data);
      })
      .catch((error) => console.log(error));
  }, [id]);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${salon?.location?.coordinates[0]},${salon.location?.coordinates[1]}`;

  const shareUrl = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this salon!",
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      alert("Web Share API is not supported in your browser.");
    }
  };

  const uniqueServices = [
    ...new Set(salon?.Services?.map((item) => item.ServiceType)),
  ];

  const services = salon?.Services?.filter((service) =>
    serviceType === "All" ? true : service.ServiceType === serviceType
  );

  return (
    <div className={styles.main}>
      <div className={styles.carosel}>
        <div className={styles.logos}>
          <Link
            onClick={() => {
              navigate(-1);
            }}
          >
            <img src={backarrow} alt="backarrow" />
          </Link>
          <div>
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <img src={Directions} alt="directions" />
            </a>
            <img src={SendArrow} alt="sendarrow" onClick={shareUrl} />
          </div>
        </div>
        <ImageCarosel images={salon?.StorePhotos} />
      </div>
      <div className={styles.details}>
        <h1>{salon?.SalonName}</h1>
        <p>4.3</p>
        <p>
          {salon?.address?.City} | {Math.ceil(distance)} kms
        </p>
      </div>
      <div className={styles.services}>
        <h3>Services</h3>
        <div className={styles.sort}>
          <button
            className={serviceType === "All" ? styles.selected : ""}
            onClick={() => {
              setServiceType("All");
            }}
          >
            All
          </button>
          {uniqueServices.map((service, index) => (
            <button
              key={index}
              className={serviceType === service ? styles.selected : ""}
              onClick={() => {
                setServiceType(service);
              }}
            >
              {service}
            </button>
          ))}
        </div>
        <div className={styles.servicelist}>
          {services?.slice(0, 4).map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
          <button className={styles.seeAll}
          onClick={() => {
            navigate(`/salon/${id}/services`, { state: { services : salon?.Services } });
            }}
          >See All</button>
        </div>
      </div>
      <div className={styles.book}>
        <button>Book</button>
      </div>
      <div className={styles.artists}>
        <h3>Team Members</h3>
        <div>
          {salon?.Artists?.map((artist, index) => (
            <div key={index} className={styles.artist}>
              <div
                style={{ backgroundImage: `url(${artist.ArtistPhoto})` }}
              ></div>
              <h4>{artist.ArtistName}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalonPage;
