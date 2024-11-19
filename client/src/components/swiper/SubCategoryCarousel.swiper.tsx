import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useLazyGetSubcategoriesQuery } from "../../store/slices/apiSlice";
import { useEffect } from "react";

interface data {
  title: string;
  data: string[];
  mainCategory: string;
}

interface SubCategory {
  image: string;
  CategoryId: string;
  CategoryName: string;
  ParentCategoryName: string;
}

const SubCategoryCarousel = ({ title, data }: data) => {
  const [
    triggerSubcategories,
    { isLoading: SubcategoryIsLoading, data: SubcategoryData },
  ] = useLazyGetSubcategoriesQuery();
  useEffect(() => {
    if (data.length) {
      triggerSubcategories({ data });
    }
  }, [title, data]);
  const filteredSubCategories = SubcategoryData?.data?.filter(
    (el: SubCategory) => el
  );

  return (
    <div className="p-2 md:px-10 flex flex-col gap-4 md:gap-6">
      <p className="font-semibold md:text-2xl w-fit">{title}</p>

      {!SubcategoryIsLoading && SubcategoryData?.data ? (
        <>
          <Swiper
            slidesPerView={3.3}
            className="swiper_container block md:hidden relative  w-full h-fit"
          >
            {" "}
            {filteredSubCategories?.map(
              ({ image, path, CategoryName }: any, i: number) => (
                <SwiperSlide className="slide  w-full p-2 h-fit " key={i}>
                  <Link to={path} className="">
                    <div className="flex items-center leading-none justify-center flex-col gap-3">
                      <img
                        src={image}
                        className="w-28 aspect-square rounded-full md:w-32 lg:w-40 object-cover object-top"
                        alt=""
                      />
                      <p className="text-center text-sm md:text-md font-semibold">
                        {CategoryName.slice(0, 1).toUpperCase() +
                          CategoryName.slice(1)}
                      </p>
                    </div>
                  </Link>
                </SwiperSlide>
              )
            )}
          </Swiper>
          <Swiper
            slidesPerView={5}
            className="swiper_container hidden md:block relative  w-full h-fit"
          >
            {" "}
            {filteredSubCategories?.map(
              ({ image, path, CategoryName }: any, i: number) => (
                <SwiperSlide className="slide  w-full p-2 h-fit " key={i}>
                  <Link to={path} className="">
                    <div className="flex items-center leading-none justify-center flex-col gap-3">
                      <img
                        src={image}
                        className="w-28 aspect-square rounded-full md:w-32 lg:w-40 object-cover object-top"
                        alt=""
                      />
                      <p className="text-center text-sm md:text-md font-semibold">
                        {CategoryName.slice(0, 1).toUpperCase() +
                          CategoryName.slice(1)}
                      </p>
                    </div>
                  </Link>
                </SwiperSlide>
              )
            )}
          </Swiper>
        </>
      ) : (
        <>
          <Swiper
            slidesPerView={5}
            className="swiper_container hidden md:block relative  w-full h-fit"
          >
            {" "}
            {[...Array(5)].map((_, i) => (
              <SwiperSlide className="slide w-full p-2 h-fit " key={i}>
                <div className="flex animate-pulse items-center leading-none justify-center flex-col gap-3">
                  <div className="w-20 bg-slate-300 aspect-square rounded-full md:w-32 lg:w-40" />
                  <div className="w-20 h-5 rounded-md bg-slate-300 md:w-32 lg:w-40"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <Swiper
            slidesPerView={3.3}
            className="swiper_container block md:hidden relative  w-full h-fit"
          >
            {" "}
            {[...Array(4)].map((_, i) => (
              <SwiperSlide className="slide w-full p-2 h-fit " key={i}>
                <div className="flex animate-pulse items-center leading-none justify-center flex-col gap-3">
                  <div className="w-20 bg-slate-300 aspect-square rounded-full md:w-32 lg:w-40" />
                  <div className="w-20 h-5 rounded-md bg-slate-300 md:w-32 lg:w-40"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </div>
  );
};

export default SubCategoryCarousel;
