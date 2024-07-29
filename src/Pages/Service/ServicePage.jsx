import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { gsap } from "gsap";
import { ScrollTrigger, ScrollToPlugin } from "gsap/all";
import Header from "../../Components/Header/Header";
import ServiceCard from "../salon/Components/ServiceCard";
import styles from "./ServicePage.module.css";
import { MinuteToHours } from "../../Functions/ConvertTime";
import { VscSettings } from "react-icons/vsc";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const ServicePage = () => {
  const location = useLocation();
  const services = location.state?.services;
  const navigate = useNavigate();
  const { id } = useParams();
  const service = useSelector((state) => state.services.Services);
  const [gender, setGender] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  if (!services) {
    navigate(-1);
  }

  const filterServicesByGender = (services, gender) => {
    if (gender) {
      return services.filter(service => service.ServiceGender === gender || service.ServiceGender === "Both");
    }
    return services;
  };

  const filteredServices = filterServicesByGender(services, gender);

  const serviceCategories = [...new Set(filteredServices.map(service => service.ServiceType))];

  const [serviceType, setServiceType] = useState(serviceCategories[0] || "");
  const [NoOfServices, setNoOfServices] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [serviceData, setServiceData] = useState({});
  const servicelistRef = useRef(null);
  const sortRef = useRef(null);
  const buttonRefs = useRef([]);

  useEffect(() => {
    setNoOfServices(service.length);
    let totalCost = 0;
    let totalDuration = 0;

    service.forEach((service) => {
      const foundService = filteredServices.find(s => s._id === service.id);
      if (foundService) {
        totalCost += foundService.ServiceCost;
        totalDuration += foundService.ServiceTime;
      }
    });

    setTotalPrice(totalCost);
    setTotalDuration(totalDuration);
    setServiceData({
      NoOfServices: service.length,
      totalCost,
      totalDuration
    });
  }, [service]);

  useEffect(() => {
    serviceCategories.forEach((category) => {
      ScrollTrigger.create({
        trigger: `.${styles.servicelist} > div[data-type='${category}']`,
        start: "-130px top",
        end: "bottom top",
        onEnter: () => setServiceType(category),
        onEnterBack: () => setServiceType(category),
        scroller: servicelistRef.current,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [filteredServices, serviceCategories]);

  useEffect(() => {
    const index = serviceCategories.indexOf(serviceType);
    const button = buttonRefs.current[index];
    if (button) {
      button.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [serviceType, serviceCategories]);

  const scrollToCategory = (type) => {
    const categoryElement = document.querySelector(
      `.${styles.servicelist} > div[data-type='${type}']`
    );
    if (categoryElement && servicelistRef.current) {
      gsap.to(servicelistRef.current, {
        duration: 1,
        scrollTo: { y: categoryElement.offsetTop - servicelistRef.current.offsetTop },
        ease: "power2.inOut",
      });
    }
  };

  return (
    <div className={styles.main}>
      <Header text={"Services"} />
      <div className={styles.services}>
        <div className={styles.sort} ref={sortRef}>
          <button
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "20px"
            }}
            onClick={() => {
              setShowCancelModal(true);
            }}
          >
            <VscSettings />
          </button>
          {serviceCategories.map((service, index) => (
            <button
              key={index}
              ref={(el) => (buttonRefs.current[index] = el)}
              className={serviceType === service ? styles.selected : ""}
              onClick={() => {
                setServiceType(service);
                scrollToCategory(service);
              }}
            >
              {service}
            </button>
          ))}
          <div className={styles.indicator}></div>
        </div>
        <div className={styles.servicelist} ref={servicelistRef}>
          {serviceCategories.map((category) => (
            <div key={category} data-type={category}>
              <h2 className={styles.categoryHeader}>{category}</h2>
              {filteredServices
                .filter((service) => service.ServiceType === category)
                .map((service, index) => (
                  <ServiceCard key={index} service={service} />
                ))}
            </div>
          ))}
        </div>
      </div>
      {NoOfServices > 0 && (
        <div className={styles.book}>
          <div>
            <h4 style={{ fontWeight: "500" }}>₹{totalPrice}</h4>
            <div
              style={{
                marginTop: "5px",
                display: "flex",
                gap: "5px",
                color: "#676767",
              }}
            >
              <p>
                {NoOfServices} Service{NoOfServices > 1 ? "s" : ""} •
              </p>
              <p>
                {MinuteToHours(totalDuration)}
              </p>
            </div>
          </div>
          <button
            className={styles.button}
            onClick={() => {
              if (NoOfServices > 0) navigate(`/salon/${id}/artists`, { state: serviceData });
            }}
          >
            Continue
          </button>
        </div>
      )}
      {showCancelModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div style={{width:"100%",paddingLeft:"10px"}}>
              <h3>Set Gender</h3>
              <div style={{display:"flex",flexDirection:"column"}}>
                <label htmlFor="male">
                  Male
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="Male"
                    onChange={(e) => setGender(e.target.value)}
                    />
                    </label>
                <label htmlFor="female">
                  Female
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="Female"
                    onChange={(e) => setGender(e.target.value)}
                  />
                </label>
                <label htmlFor="both">
                  Both
                  <input
                    type="radio"
                    id="both"
                    name="gender"
                    value=""
                    onChange={(e) => setGender(e.target.value)}
                  />
                </label>
              </div>
              <button onClick={() => setShowCancelModal(false)} className={styles.setgender}>
                Set Gender
              </button>
            </div>
            <button
              onClick={() => setShowCancelModal(false)}
              className={styles.closeButton}
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePage;
