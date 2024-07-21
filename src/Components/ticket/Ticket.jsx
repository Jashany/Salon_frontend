import styles from './Ticket.module.css';
const Ticket = ({text}) => {
    return ( 
        <div className={styles.container}>
            <div>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
            </div>
            <p>
                {text}
            </p>
            <div>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
            </div>
        </div>
     );
}
 
export default Ticket;