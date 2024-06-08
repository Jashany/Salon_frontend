import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './styles.css';

// import required modules
import { Pagination,Autoplay } from 'swiper/modules';

const ImageCarosel = (image) => {
    console.log(image)
    const images = image.images;
    return ( 
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
     );
}
 
export default ImageCarosel;