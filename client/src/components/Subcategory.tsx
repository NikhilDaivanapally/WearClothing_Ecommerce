import React from "react";
import { Link } from "react-router-dom";

// Define the structure of a Category type
interface Category {
  id: number;
  name: string;
  subcategories?: Category[]; // Subcategories are optional
}

interface SubCategoryProps {
  categories: Category[] | undefined;
  path?: String; // An array of Category objects
  setIsHovered: React.Dispatch<React.SetStateAction<boolean>>;
}

const SubcategoryList: React.FC<SubCategoryProps> = ({
  categories,
  path,
  setIsHovered,
}) => {
  // Recursive component to render categories and subcategories
  return (
    <>
      {categories?.length
        ? categories?.map((category) => (
            <div
              key={category.id}
              className="text-gray-500 hover:font-semibold"
            >
              <Link
                to={`${path}/${category.name}`}
                onClick={() => setIsHovered(false)}
              >
                <p className="text-[15px] font-['gilroy']">{category.name}</p>
              </Link>
              {category.subcategories?.length ? (
                <SubcategoryList
                  categories={category.subcategories}
                  setIsHovered={setIsHovered}
                />
              ) : null}
            </div>
          ))
        : null}
    </>
  );
};

export default SubcategoryList;
