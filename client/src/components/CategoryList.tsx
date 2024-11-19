import React from "react";
import SubcategoryList from "./Subcategory";
import { Link } from "react-router-dom";

// Define the structure of a Category type
interface Category {
  id: number;
  name: string;
  subcategories?: Category[]; // Subcategories are optional
}

interface CategoryListProps {
  categories: Category[]; // An array of Category objects
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  // Recursive component to render categories and subcategories
  return (
    <>
      {categories.map((category) => (
        <li
          key={category.id}
          className="flex flex-col font-['neue']  h-full px-5 before:absolute border-b-[0px] border-black hover:border-b-[2px] leading-none justify-center cursor-pointer group"
        >
          <Link to={`/${category.name.toLowerCase()}`}>
            <p className="text-[20px]">{category.name}</p>
          </Link>
          {category.subcategories?.length ? (
            <div className="menu p-4  hidden absolute z-50 top-full left-[40%] -translate-x-1/2 w-fit h-[200px] px-10 bg-gray-50 group-hover:flex gap-5">
              {category.subcategories.map((subcategory) => {
                return (
                  <div
                    key={subcategory.id}
                    className="w-36 flex flex-col items-center gap-1"
                  >
                    <Link
                      to={`/${category.name.toLowerCase()}/${subcategory.name.toLowerCase()}`}
                    >
                      <p className="text-[16px] font-['gilroy'] font-semibold mb-2">
                        {subcategory.name}
                      </p>
                    </Link>{" "}
                    <SubcategoryList
                      path={`/${category.name.toLowerCase()}/${subcategory.name.toLowerCase()}`}
                      categories={subcategory.subcategories}
                    />
                  </div>
                );
              })}
            </div>
          ) : null}
        </li>
      ))}
    </>
  );
};

export default CategoryList;
