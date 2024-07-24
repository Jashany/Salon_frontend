import { setArtist } from '../../../Slices/artistSlice';
import styles from './ArtistCard.module.css'
import { useDispatch } from "react-redux";
import { useNavigate,useParams } from 'react-router-dom';
import stargold from "../../../assets/stargold.svg";

const ArtistCard = ({artist,state}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { salonid } = useParams();
    const onSubmit = () =>{
        dispatch(setArtist({id: artist._id}));
        sessionStorage.setItem('artist', JSON.stringify(artist.ArtistName));
        navigate(`/salon/${salonid}/${artist._id}`,{state});
    }
    const averageRating = artist.reviews.reduce((total, review) => total + review.Rating, 0) / artist.reviews.length || 0 

    const imageExist = artist?.ArtistPhoto === null || artist?.ArtistPhoto === 'undefined' || artist?.ArtistPhoto === undefined;
    return ( 
        <div className={styles.card} onClick={onSubmit}>

            {!imageExist ? (
            <div className={styles.image} style={{
                backgroundImage: `url(${artist.ArtistPhoto})`,
                position: 'relative'
            }}>
                <div className={styles.artistRating}>
                    <img src={stargold} alt="rating" />
                    <p>{averageRating}</p>
                </div>
            </div>
            ) : (
            <div className={styles.image} style={{
                background: 'radial-gradient(circle, #e0ebdf, #d0e8be)',
                borderRadius: '50%',
                width: '90px',
                height: '90px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
            }}>
                <p style={{ color: '#047a04', fontSize: '20px' }}>{artist.ArtistName[0]}</p>
                {averageRating > 0 && (
                <div className={styles.artistRating}>
                    <p>{averageRating}</p>
                    <img src={stargold} alt="rating" />
                </div>
                )}
            </div>
            )}
            <h4>{artist.ArtistName}</h4>
            <h5 style={{
                fontWeight: 400
            }}>{artist.ArtistType}</h5>
        </div>
     );
}
 
export default ArtistCard;