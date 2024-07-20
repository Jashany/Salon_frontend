import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { gsap } from "gsap";
import { ScrollTrigger, ScrollToPlugin } from "gsap/all";
import Header from "../../Components/Header/Header";
import ServiceCard from "../salon/Components/ServiceCard";
import styles from "./ServicePage.module.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const ServicePage = () => {
  const location = useLocation();
  const services = location.state?.services;
  const navigate = useNavigate();
  const { id } = useParams();
  const service = useSelector((state) => state.services.Services);

  if (!services) {
    navigate(-1);
  }

  // Count the number of services in each category
  const serviceCounts = services.reduce((acc, service) => {
    acc[service.ServiceType] = (acc[service.ServiceType] || 0) + 1;
    return acc;
  }, {});

  // Sort services by category and number of services in each category
  const sortedCategories = Object.keys(serviceCounts).sort(
    (a, b) => serviceCounts[b] - serviceCounts[a]
  );

  const sortedServices = [...services].sort((a, b) => {
    if (serviceCounts[a.ServiceType] > serviceCounts[b.ServiceType]) return -1;
    if (serviceCounts[a.ServiceType] < serviceCounts[b.ServiceType]) return 1;
    return 0;
  });

  const [serviceType, setServiceType] = useState(sortedCategories[0] || "");
  const [NoOfServices, setNoOfServices] = useState(0);
  const servicelistRef = useRef(null);
  const sortRef = useRef(null);
  const buttonRefs = useRef([]);

  useEffect(() => {
    setNoOfServices(service.length);
  }, [service]);

  useEffect(() => {
    sortedCategories.forEach((category) => {
      ScrollTrigger.create({
        trigger: `.${styles.servicelist} > div[data-type='${category}']`,
        start: "top center",
        end: "bottom center",
        onEnter: () => setServiceType(category),
        onEnterBack: () => setServiceType(category),
        scroller: servicelistRef.current,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [sortedServices, sortedCategories]);

  useEffect(() => {
    const index = sortedCategories.indexOf(serviceType);
    const button = buttonRefs.current[index];
    if (button) {
      button.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [serviceType, sortedCategories]);

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
          {sortedCategories.map((service, index) => (
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
          {sortedCategories.map((category) => (
            <div key={category} data-type={category}>
              <h2 className={styles.categoryHeader}>{category}</h2>
              {sortedServices
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
          <h4>{NoOfServices} Services added</h4>
          <button
            className={styles.button}
            onClick={() => {
              if (NoOfServices > 0) navigate(`/salon/${id}/artists`);
            }}
          >
            Book
          </button>
        </div>
      )}
    </div>
  );
};

export default ServicePage;
