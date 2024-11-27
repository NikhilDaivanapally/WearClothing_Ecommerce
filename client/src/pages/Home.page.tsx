import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import BannerCarousel from "../components/swiper/BannerCarousel.swiper.tsx";
import SubCategoryCarousel from "../components/swiper/SubCategoryCarousel.swiper.tsx";
import { Link } from "react-router-dom";
import { RootState } from "../store/Store.ts";
import { Category } from "../TsInterfaces/Interfaces.ts";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const Categories = useSelector(
    (state: RootState) => state.categories.Category
  );

  const CategoriesWiseSubCategories: Record<string, string[]> = {
    Mens: [],
    Kids: [],
    Womens: [],
  };

  const getIds = (categories: Category[], name: string) => {
    categories.forEach((el: Category) => {
      if (el?.subcategories?.length) {
        getIds(el.subcategories, name);
      } else {
        if (CategoriesWiseSubCategories[name]) {
          CategoriesWiseSubCategories[name].push(String(el?.id));
        }
      }
    });
  };

  Categories.forEach((el: Category) => {
    getIds(el.subcategories || [], el.name);
  });

  return (
    <div className="w-full">
      <BannerCarousel />
      <p className="text-center text-lg md:text-2xl font-semibold mt-4">
        Categories
      </p>
      <div className="flex justify-center gap-2 md:gap-20 p-2">
        {[
          {
            img: "https://res.cloudinary.com/dchpasekr/image/upload/v1727944860/uxbjnvozphpsbw050khk.jpg",
            category: "Mens",
          },
          {
            img: "https://res.cloudinary.com/dchpasekr/image/upload/v1728825795/pwjrsylutby9auv1yp9y.jpg",
            category: "Womens",
          },
          {
            img: "https://res.cloudinary.com/dchpasekr/image/upload/v1729164905/hiuf0sahfbwazx37wil9.jpg",
            category: "Kids",
          },
        ].map(({ img, category }, i) => {
          return (
            <Link key={i} to={`/${category.toLowerCase()}`}>
              <div className="flex flex-col border-[1px] max-w-[250px] h-fit bg-white">
                <div className="flex-1 p-2">
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
                <button className=" md:text-lg">{category}</button>
              </div>
            </Link>
          );
        })}
      </div>{" "}
      {/* SubCategoryCarousel For Men */}
      <SubCategoryCarousel
        title={"Shop For Men"}
        mainCategory={"mens"}
        data={CategoriesWiseSubCategories?.Mens}
      />
      {/* SubCategoryCarousel For Women */}
      <SubCategoryCarousel
        title={"Shop For Women"}
        mainCategory={"womens"}
        data={CategoriesWiseSubCategories?.Womens}
      />
      {/* SubCategoryCarousel For kids */}
      <SubCategoryCarousel
        title={"Shop For Kids"}
        mainCategory={"kids"}
        data={CategoriesWiseSubCategories?.Kids}
      />
    </div>
  );
};
export default Home;
