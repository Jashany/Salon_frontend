import styles from './ServiceCard.module.css'

const ServiceCard = ({service}) => {
    const convertTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours > 0 ? `${hours} hour(s)` : ''} ${mins > 0 ? `${mins} min` : ''}`.trim();
    };

    return ( 
        <div className={styles.service}>
            <div>
            <h4>{service?.ServiceName}</h4>
            <p>{convertTime(service?.ServiceTime)}</p>
            <p>₹{service?.ServiceCost}</p>
            </div>
            <div>
                <button>Add</button>
            </div>
        </div>
     );
}
 
export default ServiceCard;