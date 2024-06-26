import { setArtist } from '../../../Slices/artistSlice';
import styles from './ArtistCard.module.css'
import { useDispatch } from "react-redux";
import { useNavigate,useParams } from 'react-router-dom';
import stargold from "../../../assets/stargold.svg";

const ArtistCard = ({artist}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { salonid } = useParams();
    const onSubmit = () =>{
        dispatch(setArtist({id: artist._id}));
        navigate(`/salon/${salonid}/${artist._id}`, { state: { artist } });
    }
    const averageRating = artist.reviews.reduce((total, review) => total + review.Rating, 0) / artist.reviews.length || 0 
    return ( 
        <div className={styles.card} onClick={onSubmit}>
            <div className={styles.image} style={{
                backgroundImage: `url(${artist.ArtistPhoto})`,
                position: 'relative'
            }}>
                <div className={styles.artistRating}>
                    <img src={stargold} alt="rating" />
                    <p>{averageRating}</p>
                </div>
            </div>
            <h4>{artist.ArtistName}</h4>
            <h5>{artist.ArtistType}</h5>
        </div>
     );
}
 
export default ArtistCard;