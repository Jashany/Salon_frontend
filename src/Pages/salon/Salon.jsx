import { useParams } from "react-router-dom";
import styles from "./SalonPage.module.css";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import backarrow from "../../assets/BackArrow.png";
import Directions from "../../assets/Directions.png";
import SendArrow from "../../assets/SendArrow.png";
import ImageCarosel from "./Components/ImageCarosel";
import ServiceCard from "./Components/ServiceCard";
import { useSelector } from "react-redux";
import Loader from "../../Components/Loader/Loader";
import stargold from "../../assets/stargold.svg";
import star from "../../assets/star.svg";
import OffersCarousel from "./Components/OfferCarosel";

const SalonPage = () => {
  const location = useLocation();
  const [serviceType, setServiceType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [NoOfServices, setNoOfServices] = useState(0);
  const service = useSelector((state) => state.services.Services);

  useEffect(() => {
    setNoOfServices(service.length);
  }, [service]);

  const distance = location.state?.distance;
  const [salon, setSalon] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    fetch(`https://api.salondekho.in/api/salon/getSalon/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setSalon(data);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      });
  }, [id]);

  if (loading) {
    return <Loader />;
  }

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

  const averageRating =
    salon?.Reviews?.reduce((total, review) => total + review.Rating, 0) /
      salon?.Reviews?.length || 0;

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
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: "5px",
              }}
            >
              <img src={Directions} alt="directions" />
            </a>
            <img src={SendArrow} alt="sendarrow" onClick={shareUrl} />
          </div>
        </div>
        <ImageCarosel images={salon?.StorePhotos} />
      </div>
      <div className={styles.details}>
        <h1>{salon?.SalonName}</h1>
        {averageRating > 0 && (
          <div className={styles.rating}>
            <img src={stargold} alt="rating" />
            <p>{averageRating}</p>
          </div>
        )}
        <p>
          {salon?.address?.City} | {Math.ceil(distance)} kms
        </p>
      </div>
      {salon?.offers > 0 &&
            (<div className="offers">
              <OffersCarousel salon={salon} />
            </div>)
      }
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
              style={{
                whiteSpace: "nowrap",
              }}
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
          <button
            className={styles.seeAll}
            onClick={() => {
              navigate(`/salon/${id}/services`, {
                state: { services: salon?.Services },
              });
            }}
          >
            See All
          </button>
        </div>
      </div>
      <div className={styles.book}>
        <h4>{NoOfServices} Services added</h4>
        <button
          onClick={() => {
            if (NoOfServices > 0) navigate(`/salon/${id}/artists`);
          }}
        >
          {NoOfServices > 0 ? "Book Now" : "Add Services"}
        </button>
      </div>
      <div className={styles.artists}>
        <h3>Team Members</h3>
        <div>
          {salon?.Artists?.map((artist, index) => {
            const averageRating =
              artist.reviews.reduce(
                (total, review) => total + review.Rating,
                0
              ) / artist.reviews.length || 0;
            return (
              <div key={index} className={styles.artist}>
                {artist.ArtistPhoto === "" ? (
                  <div
                    style={{
                      backgroundColor: "black",
                      borderRadius: "50%",
                      width: "90px",
                      height: "90px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <p style={{ color: "white", fontSize: "20px" }}>
                      {artist.ArtistName[0]}
                    </p>
                    <div className={styles.artistRating}>
                      <img src={stargold} alt="rating" />
                      <p>{averageRating}</p>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundImage: `url(${artist.ArtistPhoto})`,
                      position: "relative",
                    }}
                  >
                    <div className={styles.artistRating}>
                      <img src={stargold} alt="rating" />
                      <p>{averageRating}</p>
                    </div>
                  </div>
                )}
                <h4>{artist.ArtistName}</h4>
              </div>
            );
          })}
        </div>
      </div>
      {salon?.Reviews?.length > 0 && (
        <div className={styles.reviews}>
          <h3>Reviews</h3>
          <div>
            {salon?.Reviews?.map((review, index) => {
              const ratingStars = [];

              for (let i = 0; i < 5; i++) {
                if (i < review?.Rating) {
                  ratingStars.push(
                    <img src={stargold} className={styles.star} />
                  );
                } else {
                  ratingStars.push(<img src={star} className={styles.star} />);
                }
              }
              return (
                <div key={index} className={styles.review}>
                  <div>
                    <h4>{review?.userId?.name}</h4>
                  </div>
                  <div>{ratingStars}</div>
                  <div>
                    <p>{review.Review}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonPage;
