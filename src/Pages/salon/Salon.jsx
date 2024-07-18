import { useParams } from "react-router-dom";
import styles from "./SalonPage.module.css";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import backarrow from "../../assets/Arrows.svg";
import Directions from "../../assets/Frame1.svg";
import SendArrow from "../../assets/Frame2.svg";
import ImageCarosel from "./Components/ImageCarosel";
import ServiceCard from "./Components/ServiceCard";
import { useSelector } from "react-redux";
import Loader from "../../Components/Loader/Loader";
import stargold from "../../assets/stargold.svg";
import star from "../../assets/star.svg";
import OffersCarousel from "./Components/OfferCarosel";
import haversineDistance from "haversine-distance";

const SalonPage = () => {
  const location = useLocation();
 
  const [loading, setLoading] = useState(true);
  const service = useSelector((state) => state.services.Services);
  const [serviceType, setServiceType] = useState("");
 
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
        setServiceType(salon?.Services[0]?.ServiceType);
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


  const allPhotos = [salon?.CoverImage, ...salon?.StorePhotos];
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
        <ImageCarosel images={allPhotos} />
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
      {salon?.offers.length > 0 && (
        <div className="offers">
          <OffersCarousel salon={salon} />
        </div>
      )}
      <div className={styles.services}>
        <h3>Services</h3>
        <div className={styles.sort}>
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
            <div onClick={()=>{
              navigate(`/salon/${id}/services`, {
                state: { services: salon?.Services },
              });
            }}>
            <ServiceCard key={index} service={service} />
            </div>
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
      <div className={styles.artists}>
        <h3>Team Members</h3>
        <div style={{
          alignItems:"flex-start"
        }}>
          {salon?.Artists?.map((artist, index) => {
            const averageRating =
              artist.reviews.reduce(
                (total, review) => total + review.Rating,
                0
              ) / artist.reviews.length || 0;
              const imageExist = artist?.ArtistPhoto === null || artist?.ArtistPhoto === 'undefined' || artist?.ArtistPhoto === undefined;
            return (
              <div key={index} className={styles.artist}>
                {imageExist ? (
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
                    {averageRating > 0 && (
                    <div className={styles.artistRating}>
                      <img src={stargold} alt="rating" />
                      <p>{averageRating}</p>
                    </div>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundImage: `url(${artist.ArtistPhoto})`,
                      position: "relative",
                    }}
                  >
                    {averageRating > 0 && (
                    <div className={styles.artistRating}>
                      <img src={stargold} alt="rating" />
                      <p>{averageRating}</p>
                    </div>
                    )}
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
                    <h4 style={{fontSize:"1.10rem"}}>{review?.customerId?.name}</h4>
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
