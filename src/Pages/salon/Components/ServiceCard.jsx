import styles from './ServiceCard.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { setServices, removeServices } from '../../../Slices/servicesSlice';
import { useState, useCallback, useEffect } from 'react';

const ServiceCard = ({ service }) => {
    const dispatch = useDispatch();
    const services = useSelector((state) => state.services.Services); // Note the correction here
    const isServiceAdded = services?.some(s => s.id === service._id);
    const [buttonText, setButtonText] = useState(isServiceAdded ? "Added" : "Add");

    const convertTime = useCallback((minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours > 0 ? `${hours} hr` : ''} ${mins > 0 ? `${mins} min` : ''}`.trim();
    }, []);

    useEffect(() => {
        setButtonText(isServiceAdded ? "Added" : "Add");
    }, [isServiceAdded]);

    const toggleService = () => {
        if (buttonText === "Add") {
            dispatch(setServices({ id: service._id }));
            setButtonText("Added");
        } else {
            dispatch(removeServices({ id: service._id }));
            setButtonText("Add");
        }
    };

    const gender = service?.ServiceGender === "Both" ? "Unisex" : service?.ServiceGender;

    return (
        <div className={styles.service}>
            <div>
                <h4>{service?.ServiceName} 
                    
                </h4>
                <p>{convertTime(service?.ServiceTime)} ·  {gender}</p>
                <p style={{color:"black",marginTop:"10px"}}>₹{service?.ServiceCost}</p>
            </div>
            <div>
                <button  className={buttonText === "Added" ? styles.selected : ''}  onClick={toggleService}>
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default ServiceCard;
