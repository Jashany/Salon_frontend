import React, { useEffect, useRef } from "react";
import styles from "./ServicePage.module.css";

import { Link, useLocation } from "react-router-dom";
import ServiceCard from "../salon/Components/ServiceCard";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Header from "../../Components/Header/Header";

const ServicePage = () => {
  const location = useLocation();
  const services = location.state?.services;
  const navigate = useNavigate();

  if(!services){
    navigate(-1);
  }

  const [serviceType, setServiceType] = useState(`${services[0]?.ServiceType}`);
  const uniqueServices = [
    ...new Set(services?.map((item) => item.ServiceType)),
  ];
  const observerRef = useRef(null);
  const [NoOfServices, setNoOfServices] = useState(0);
  const service = useSelector((state) => state.services.Services);
  //read id from params
  const { id } = useParams();

  useEffect(() => {
    setNoOfServices(service.length);
  }, [service]);

  const filteredservices = services?.filter(
    (service) => service.ServiceType === serviceType
  );

  useEffect(() => {
    const options = {
      root: document.querySelector(`.${styles.servicelist}`),
      rootMargin: "0px",
      threshold: 0.5,
    };

    observerRef.current = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setServiceType(entry.target.dataset.type);
        }
      });
    }, options);

    const serviceElements = document.querySelectorAll(
      `.${styles.servicelist} > div`
    );
    serviceElements.forEach((element) => observerRef.current.observe(element));

    return () => {
      observerRef.current.disconnect();
    };
  }, [services]);

  return (
    <div className={styles.main}>
      <div>
        <Header text={"Services"} />
        <div className={styles.services}>
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
            {filteredservices?.map((service, index) => (
              <div key={index} data-type={service.ServiceType}>
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {NoOfServices > 0 && (
        <div className={styles.book}>
        <h4>{NoOfServices} Services added</h4>
        <button
        
        className={styles.button}
         onClick={() => {
            if(NoOfServices > 0)
            navigate(`/salon/${id}/artists`);
          }}>
          Book
          </button>
      </div>
      )}
    </div>
  );
};

export default ServicePage;
