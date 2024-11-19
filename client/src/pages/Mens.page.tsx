import SubCategoryCarousel from "../components/swiper/SubCategoryCarousel.swiper";
import BannerCarousel from "../components/swiper/BannerCarousel.swiper";
import NewArrivals from "../components/swiper/NewArrivals.swiper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/Store";
import { useLazyGetNewArrivalsQuery } from "../store/slices/apiSlice";
import { useEffect } from "react";
import { UpdateNewArrivals } from "../store/slices/mainSlice";

interface Category {
  id: string;
  name: string;
  subcategories?: Category[]; // Subcategories are optional
}

const Mens = () => {
  const dispatch = useDispatch();
  const Categories = useSelector(
    (state: RootState) => state.categories.Category
  );
  const { MensNewArrivals } = useSelector((state: RootState) => state.main);
  const MenCategoryId = Categories.filter((el: Category) => el?.name == "Mens");

  //function  to get the nested SubCategory id
  const IdsArray: string[] = [];
  const getIds = (catgories: Category[]) => {
    catgories?.map((el: Category) => {
      if (el?.subcategories?.length) {
        return getIds(el?.subcategories);
      } else {
        IdsArray.push(el?.id);
      }
    });
  };
  getIds(MenCategoryId);

  const [
    triggerGetNewArrivals,
    { isSuccess: newArrivalsIsSuccess, data: newArrivalsData },
  ] = useLazyGetNewArrivalsQuery();

  useEffect(() => {
    if (Categories.length) {
      triggerGetNewArrivals({ ids: IdsArray });
    }
  }, [Categories]);

  
  useEffect(() => {
    if (newArrivalsIsSuccess) {
      dispatch(
        UpdateNewArrivals({
          category: "MensNewArrivals",
          items: newArrivalsData?.data,
        })
      );
    }
  }, [newArrivalsIsSuccess, newArrivalsData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full">
      <BannerCarousel />
      {/* SubCategoryCarousel For Men */}
      <SubCategoryCarousel
        title={"Shop For Men"}
        mainCategory={"mens"}
        data={IdsArray}
      />
      <div className="hidden md:block">
        <NewArrivals slidesperview={4} data={MensNewArrivals} />
      </div>{" "}
      <div className="block md:hidden">
        <NewArrivals slidesperview={2} data={MensNewArrivals} />
      </div>
    </div>
  );
};

export default Mens;
