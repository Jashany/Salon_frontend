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
import clock from "../../assets/clock.png";
import phone from "../../assets/call-calling.png";
import { ConvertTime } from "../../Functions/ConvertTime";
import insta from "../../assets/insta.webp";
import { MinuteToHours } from "../../Functions/ConvertTime";


const SalonPage = () => {
  const location = useLocation();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const service = useSelector((state) => state.services.Services);
  const [serviceType, setServiceType] = useState("");
  const [NoOfServices, setNoOfServices] = useState(service.length);
  const [serviceData, setServiceData] = useState({});

  const distance = location.state?.distance;
  const [salon, setSalon] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    setLoading(true);
    let totalCost = 0;
    let totalDuration = 0;

    fetch(`https://api.salondekho.in/api/salon/getSalon/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setSalon(data);
        setTimeout(() => {
          setLoading(false);
        }, 300);
        setServiceType(data?.Services[0]?.ServiceType);
        service.forEach((services) => {
          const foundService = data?.Services.find((s) => s._id === services.id);
          if (foundService) {
            console.log(foundService);
            // Assuming each service object has `cost` and `duration` properties
            totalCost += foundService.ServiceCost;
            totalDuration += foundService.ServiceTime;
          }
          
          setTotalPrice(totalCost);
          setTotalDuration(totalDuration);
          setServiceData({
            NoOfServices,
            totalCost,
            totalDuration,
          })
        });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });


     
      // Assuming `service` is an array of selected service IDs
     
  
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

  const rating =
    averageRating % 1 === 0 ? averageRating : averageRating.toFixed(1);


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
      <div className={styles.upperPart}>
        <div className={styles.details}>
          <h1>{salon?.SalonName}</h1>
          
          <p>{salon?.address?.City}</p>
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <p style={{fontSize:"14px"}}>
              {ConvertTime(salon?.startTime)} - {ConvertTime(salon?.endTime)}
            </p>
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.logoIcon}>
            <div>
              <a href={`tel:${salon?.salonPhoneNumber}`}>
                <img src={phone} alt="phone" />
              </a>
            </div>
            {salon?.Instagram && (
              <div>
                <a
                  href={salon?.Instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img className={styles.insta} src={insta} alt="instagram" />
                </a>
              </div>
            )}
          </div>
          {averageRating > 0 && (
            <div className={styles.rating}>
              <p>{rating}</p>
              <img src={stargold} alt="rating" />
            </div>
          )}
        </div>
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
            <div
              onClick={() => {
                navigate(`/salon/${id}/services`, {
                  state: { services: salon?.Services },
                });
              }}
            >
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
        <div
          style={{
            alignItems: "flex-start",
          }}
        >
          {salon?.Artists?.map((artist, index) => {
            const averageRating =
              artist.reviews.reduce(
                (total, review) => total + review.Rating,
                0
              ) / artist.reviews.length || 0;
            const imageExist =
              artist?.ArtistPhoto === null ||
              artist?.ArtistPhoto === "undefined" ||
              artist?.ArtistPhoto === undefined;
            return (
              <div key={index} className={styles.artist}>
                {imageExist ? (
                  <div
                    style={{
                      background: "#b6ffef",
                      borderRadius: "50%",
                      width: "90px",
                      height: "90px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <p style={{ color: "#047a04", fontSize: "30px" }}>
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
                        <p>{averageRating}</p>
                        <img src={stargold} alt="rating" />
                      </div>
                    )}
                  </div>
                )}
                <h4 style={{ fontSize: "12.5px" }}>{artist.ArtistName}</h4>
                <p style={{ fontSize: "12px", color: "#313030" }}>
                  {artist.ArtistType}
                </p>
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
                    <h4 style={{ fontSize: "1rem" }}>
                      {review?.customerId?.name}
                    </h4>
                  </div>
                  <div>{ratingStars}</div>
                  {review?.Review && (
                    <div>
                      <p>{review.Review}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {NoOfServices > 0 && (
        <div className={styles.book}>
          <div>
            <h4 style={{ fontWeight: "500" }}>₹{totalPrice}</h4>
            <div
              style={{
                marginTop: "5px",
                display: "flex",
                gap: "5px",
              }}
            >
              <p>
                {NoOfServices} Service{NoOfServices > 1 ? "s" : ""} •
              </p>
              <p>{MinuteToHours(totalDuration)}</p>
            </div>
          </div>
          <button
            className={styles.button}
            onClick={() => {
              if (NoOfServices > 0) navigate(`/salon/${id}/artists`, { state: { serviceData } });
            }}
          >
            Book
          </button>
        </div>
      )}
    </div>
  );
};

export default SalonPage;
