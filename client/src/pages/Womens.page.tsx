import { useDispatch, useSelector } from "react-redux";
import BannerCarousel from "../components/swiper/BannerCarousel.swiper";
import NewArrivals from "../components/swiper/NewArrivals.swiper";
import SubCategoryCarousel from "../components/swiper/SubCategoryCarousel.swiper";
import { RootState } from "../store/Store";
import { Category } from "../TsInterfaces/Interfaces";
import { useLazyGetNewArrivalsQuery } from "../store/slices/apiSlice";
import { useEffect } from "react";
import { UpdateNewArrivals } from "../store/slices/mainSlice";

const Womens = () => {
  const dispatch = useDispatch();
  const Categories = useSelector(
    (state: RootState) => state.categories.Category
  );
  const { WomensNewArrivals } = useSelector((state: RootState) => state.main);
  const WomenCategoryId = Categories.filter(
    (el: Category) => el?.name == "Womens"
  );

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
  getIds(WomenCategoryId);

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
          category: "WomensNewArrivals",
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
      {/* SubCategoryCarousel For Women */}
      <SubCategoryCarousel
        title={"Shop For Women"}
        mainCategory={"womens"}
        data={IdsArray}
      />
      <div className="hidden md:block">
        <NewArrivals slidesperview={4} data={WomensNewArrivals} />
      </div>{" "}
      <div className="block md:hidden">
        <NewArrivals slidesperview={2} data={WomensNewArrivals} />
      </div>
    </div>
  );
};

export default Womens;
