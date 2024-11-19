import { useEffect } from "react";
import BannerCarousel from "../components/swiper/BannerCarousel.swiper";
import NewArrivals from "../components/swiper/NewArrivals.swiper";
import SubCategoryCarousel from "../components/swiper/SubCategoryCarousel.swiper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/Store";
import { useLazyGetNewArrivalsQuery } from "../store/slices/apiSlice";
import { UpdateNewArrivals } from "../store/slices/mainSlice";
interface Category {
  id: string;
  name: string;
  subcategories?: Category[]; // Subcategories are optional
}
const Kids = () => {
  const dispatch = useDispatch();
  const Categories = useSelector(
    (state: RootState) => state.categories.Category
  );
  const { KidsNewArrivals } = useSelector((state: RootState) => state.main);
  const KidCategoryId = Categories.filter((el: Category) => el?.name == "Kids");

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
  getIds(KidCategoryId);

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
          category: "KidsNewArrivals",
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
      {/* SubCategoryCarousel For Kids */}
      <SubCategoryCarousel
        title={"Shop For Kids"}
        mainCategory={"kids"}
        data={IdsArray}
      />
      <div className="hidden md:block">
        <NewArrivals slidesperview={4} data={KidsNewArrivals} />
      </div>{" "}
      <div className="block md:hidden">
        <NewArrivals slidesperview={2} data={KidsNewArrivals} />
      </div>
    </div>
  );
};

export default Kids;
