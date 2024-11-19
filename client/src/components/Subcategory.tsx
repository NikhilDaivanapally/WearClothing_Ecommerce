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
}

const SubcategoryList: React.FC<SubCategoryProps> = ({ categories, path }) => {
  // Recursive component to render categories and subcategories
  return (
    <>
      {categories?.length
        ? categories?.map((category) => (
            <div key={category.id} className="hover:font-semibold">
              <Link to={`${path}/${category.name}`}>
                <p className="text-[15px] font-['gilroy']">{category.name}</p>
              </Link>
              {category.subcategories?.length ? (
                <SubcategoryList categories={category.subcategories} />
              ) : null}
            </div>
          ))
        : null}
    </>
  );
};

export default SubcategoryList;
