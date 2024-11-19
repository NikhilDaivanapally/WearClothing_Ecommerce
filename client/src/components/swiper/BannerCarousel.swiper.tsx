import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import img1 from "../../assets/canva-dH4NGO2qYT4.jpg";
import img2 from "../../assets/Screenshot 2024-10-17 222044.png";
const BannerCarousel = () => {
  return (
    <Swiper
      slidesPerView={1}
      centeredSlides={true}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      navigation={false}
      modules={[Autoplay, Pagination, Navigation]}
      className="swiper w-full aspect-video max-h-[330px] mt-5"
    >
      <SwiperSlide className="slide w-full h-[90%] p-2">
        <img
          className="w-full h-full object-cover object-top"
          src={img1}
          alt=""
        />
      </SwiperSlide>
      <SwiperSlide className="slide w-full h-[90%] p-2 ">
        <img className="w-full h-full object-cover" src={img2} alt="" />
      </SwiperSlide>
      <SwiperSlide className="slide w-full h-[90%] p-2 ">
        <img
          className="w-full h-full object-cover"
          src="https://media.istockphoto.com/id/1646679245/photo/storm-mountain-british-columbia.jpg?s=612x612&w=is&k=20&c=KQ1Z9LJ_Z0ZeJIAngRTpwermL5c7MI8q4IVO2uV1qVE="
          alt=""
        />
      </SwiperSlide>
    </Swiper>
  );
};

export default BannerCarousel;
