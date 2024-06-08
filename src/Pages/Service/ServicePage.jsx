import styles from "./ServicePage.module.css";
import BackArrow from "../../assets/backArrow@.png";
import { useLocation } from "react-router-dom";
import ServiceCard from "../salon/Components/ServiceCard";
import { useState } from "react";
import menu from "../../assets/menu.png";
const ServicePage = () => {
  const [serviceType, setServiceType] = useState("All");
  const location = useLocation();
  const services = location.state?.services;
  console.log(services);

  const uniqueServices = [
    ...new Set(services?.map((item) => item.ServiceType)),
  ];

  const filteredservices = services?.filter((service) =>
    serviceType === "All" ? true : service.ServiceType === serviceType
  );

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <img src={BackArrow} alt="" />
        <h2>Services</h2>
        <img src={menu} alt="" />
      </div>
      <div className={styles.services}>
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
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
