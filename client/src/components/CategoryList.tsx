import React, { useState } from "react";
import SubcategoryList from "./Subcategory";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
      {categories.map((category) => {
        const [isHovered, setIsHovered] = useState(false);

        return (
          <li
            key={category.id}
            className="relative flex flex-col font-['gilroy'] h-full px-5 before:absolute border-b-[0px] border-black leading-none justify-center cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Link to={`/${category.name.toLowerCase()}`}>
              <p
                className={`text-[18.5px]  ${
                  isHovered ? "text-black" : "text-gray-500"
                }`}
              >
                {category.name}
              </p>
            </Link>
            <AnimatePresence>
              {isHovered && category.subcategories?.length ? (
                <motion.div
                  className="menu p-4 absolute z-50 top-full -left-[100%]   w-fit h-[200px] px-10 rounded-md bg-gray-50 flex gap-5"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  {category.subcategories.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      className="w-36 flex flex-col items-center gap-1"
                    >
                      <Link
                        to={`/${category.name.toLowerCase()}/${subcategory.name.toLowerCase()}`}
                      >
                        <p className="text-[16px] font-['gilroy'] mb-2">
                          {subcategory.name}
                        </p>
                      </Link>
                      <SubcategoryList
                        path={`/${category.name.toLowerCase()}/${subcategory.name.toLowerCase()}`}
                        categories={subcategory.subcategories}
                        setIsHovered={setIsHovered}
                      />
                    </div>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </>
  );
};

export default CategoryList;
