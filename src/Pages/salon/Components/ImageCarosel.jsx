import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './styles.css';

// import required modules
import { Pagination,Autoplay } from 'swiper/modules';

const ImageCarosel = ({images,name}) => {
    console.log(images)
    console.log(images.length)
    return ( 
            <div className="carosell">
                <div className="layer"></div>
                {images[0] != null && images.length >= 1 ? (

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
            ) : (
                <div style={{
                    backgroundColor: 'black',
                    position: 'relative',
                    height: '100%',
                    width:'100%',
                    color:"white",
                    display:'flex',
                    justifyContent:'center',
                    alignItems:'center',
                    
                }}>
                    <h4 style={{
                        fontSize:'1.65rem',
                        fontWeight:'500',
                        fontFamily:'Bodoni'
                    }}>
                        {name}
                    </h4>
                    </div>
            )}
                </div>
     );
}
 
export default ImageCarosel;