import { SetStateAction, useState } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../store/Store";
import { AnimatePresence, motion } from "framer-motion";
import { categorySlide } from "../../animation/Menu.anim";

// Define the structure of a Category type
interface Category {
  id: string;
  name: string;
  subcategories?: Category[];
}

interface CategoryListProps {
  CategoriesList: Category[];
  setIsMenuOpen: React.Dispatch<SetStateAction<boolean>>;
  path: string;
}

// Generic Category Display Component
const CategoryListDisplay = ({
  CategoriesList,
  setIsMenuOpen,
  path = "",
}: CategoryListProps) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const handleActiveSubCategory = (categoryId: string) => {
    setActiveCategoryId((prevId) => (prevId === categoryId ? null : categoryId));
  };

  return (
    <div>
      {CategoriesList.map((category: Category) => (
        <div key={category.id}>
          {category.subcategories?.length ? (
            <span
              className="relative w-full flex items-center py-1 justify-between cursor-pointer"
              onClick={() => handleActiveSubCategory(category.id)}
            >
              {category.name}
              <MdOutlineArrowForwardIos className="leading-none transition-all duration-300" />
            </span>
          ) : (
            <Link
              key={category.id}
              to={`${path}/${category.name.toLowerCase()}?id=${category.id}`}
            >
              <span
                className="relative w-full flex items-center py-1 justify-between cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </span>
            </Link>
          )}

          <AnimatePresence mode="wait">
            {activeCategoryId === category.id && category.subcategories && (
              <motion.div
                variants={categorySlide}
                initial="initial"
                animate="enter"
                exit="exit"
                className="pl-4 text-[16px] font-normal"
              >
                <CategoryListDisplay
                  path={`${path}/${category.name.toLowerCase()}`}
                  CategoriesList={category.subcategories}
                  setIsMenuOpen={setIsMenuOpen}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

// Main Category Display Component
const CategoriesListDisplay = ({
  setIsMenuOpen,
}: { setIsMenuOpen: React.Dispatch<SetStateAction<boolean>> }) => {
  const Categories = useSelector((state: RootState) => state.categories.Category);

  return (
    <>
      {Categories.map((Category: Category, i) => (
        <CategoryListDisplay
          key={i}
          CategoriesList={[Category]}
          setIsMenuOpen={setIsMenuOpen}
          path=""
        />
      ))}
    </>
  );
};

export default CategoriesListDisplay;
