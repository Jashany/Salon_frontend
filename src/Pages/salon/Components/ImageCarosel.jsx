import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './styles.css';

// import required modules
import { Pagination,Autoplay } from 'swiper/modules';

const ImageCarosel = (image) => {
    const images = image.images;
    return ( 
            <div className="carosell">
                <div className="layer"></div>
             <Swiper pagination={true} modules={[Pagination,Autoplay]} 
             autoplay={{
                 delay: 2500,
                 disableOnInteraction: false,
                }}
                className="mySwiper">
                {images?.map((image, index) => (
                    <SwiperSlide key={index}>
                        <img src={image} alt="salon" />
                    </SwiperSlide>
                ))}
            </Swiper>
                </div>
     );
}
 
export default ImageCarosel;