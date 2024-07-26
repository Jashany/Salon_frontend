import React from 'react';
import { useState } from 'react';
const OfferPage = ({salonId,Day}) => {
    const [offers, setOffers] = useState([]);
    useeffect(() => {
        fetch('https://api.example.com/items')
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                setOffers(data.offers);
            }
        })
    }, [])
    return ( 
        <div>

        </div>
     );
}
 
export default OfferPage;