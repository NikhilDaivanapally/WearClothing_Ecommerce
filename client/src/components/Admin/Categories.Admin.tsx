import { useDispatch, useSelector } from "react-redux";
import { UpdateCategoryState } from "../../store/slices/categorySlice";
import {
  useAddcategoryMutation,
  useDeletecategoryMutation,
  useEditcategoryMutation,
  useLazyGetCategoriesQuery,
} from "../../store/slices/apiSlice";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { IoIosAddCircleOutline } from "react-icons/io";
import Popbox from "./PopBox/Popbox";
import { FaXmark } from "react-icons/fa6";
import { RootState } from "../../store/Store";
import { AiOutlineDelete } from "react-icons/ai";

// Define the structure of a Category type
interface Category {
  id: number;
  name: string;
  subcategories?: Category[]; // Subcategories are optional
}

interface ParentCategory {
  id: number | null;
  name: string | null;
}

interface isEditVal {
  id: string | number;
  name: string;
}
interface CategoryListProps {
  categories: Category[] | undefined;
  setParent: React.Dispatch<React.SetStateAction<ParentCategory>>;
  setAddSubCategoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteDialogbox: Function;
  setIsDeleteCategory: React.Dispatch<React.SetStateAction<ParentCategory>>;
  setIsEditVal: React.Dispatch<React.SetStateAction<isEditVal>>;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SubcategoryList: React.FC<CategoryListProps> = ({
  categories = [],
  setParent,
  setAddSubCategoryOpen,
  handleDeleteDialogbox,
  setIsDeleteCategory,
  setIsEditVal,
  setIsEditDialogOpen,
}) => {
  return (
    <>
      {categories.map((category) => (
        <div key={category.id} className="ml-8">
          <div className="flex gap-2 items-center">
            <p className="text-[15px] font-['gilroy'] cursor-pointer p-2 w-fit bg-gray-200 my-2 rounded-md">
              {category.name}
            </p>
            <div
              className="relative group"
              onClick={() => {
                setIsEditDialogOpen(true);
                setIsEditVal({ id: category.id, name: category.name });
              }}
            >
              <CiEdit className="text-xl cursor-pointer" />
              <div className="absolute whitespace-nowrap bottom-full mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-black rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Edit {category.name} category
              </div>
            </div>
            <div className="relative group">
              <IoIosAddCircleOutline
                className="text-xl cursor-pointer"
                onClick={() => {
                  setParent({
                    id: category.id,
                    name: category.name,
                  });
                  setAddSubCategoryOpen(true);
                }}
              />
              <div className="absolute whitespace-nowrap bottom-full mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-black rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Add subcategory to {category.name}
              </div>
            </div>
            <div className="relative group">
              <AiOutlineDelete
                className="text-xl cursor-pointer"
                onClick={() => {
                  setIsDeleteCategory({
                    id: category.id,
                    name: category.name,
                  });
                  handleDeleteDialogbox();
                }}
              />
              <div className="absolute whitespace-nowrap bottom-full right-full mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-black rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Delete {category.name} category
              </div>
            </div>
          </div>
          {category.subcategories?.length ? (
            <SubcategoryList
              categories={category.subcategories}
              setAddSubCategoryOpen={setAddSubCategoryOpen}
              setParent={setParent}
              handleDeleteDialogbox={handleDeleteDialogbox}
              setIsDeleteCategory={setIsDeleteCategory}
              setIsEditVal={setIsEditVal}
              setIsEditDialogOpen={setIsEditDialogOpen}
            />
          ) : null}
        </div>
      ))}
    </>
  );
};

const CategoriesAdmin = () => {
  const [addSubCategoryOpen, setAddSubCategoryOpen] = useState<boolean>(false);
  const [parent, setParent] = useState<ParentCategory>({
    id: null,
    name: null,
  });
  const [categoryName, setCategoryName] = useState<string>("");
  const dispatch = useDispatch();
  const [isdeleteDialogOpen, setIsdeleteDialogOpen] = useState<boolean>(false);

  const [isDeleteCategory, setIsDeleteCategory] = useState<ParentCategory>({
    id: null,
    name: null,
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);

  const [isEditVal, setIsEditVal] = useState<isEditVal>({
    id: "",
    name: "",
  });

  const [
    triggerGetCategories,
    {
      isLoading: categoriesIsLoading,
      data: categoriesData,
      isSuccess: isCategoriesSuccess,
    },
  ] = useLazyGetCategoriesQuery();

  useEffect(() => {
    triggerGetCategories({});
  }, [triggerGetCategories]);

  useEffect(() => {
    if (isCategoriesSuccess && categoriesData) {
      dispatch(UpdateCategoryState(categoriesData?.data));
    }
  }, [isCategoriesSuccess, categoriesData, dispatch]);

  const categories = useSelector(
    (state: RootState) => state.categories.Category
  );

  const handleEmptyParentSetAddSubCategoryFalse = () => {
    setParent({ id: null, name: null });
    setAddSubCategoryOpen(false);
    setCategoryName("");
  };
  const handleEmptyisDeleteCategorySetIsdeleteDialogOpenFalse = () => {
    setIsDeleteCategory({ id: null, name: null });
    setIsdeleteDialogOpen(false);
    setCategoryName("");
  };

  const [addCategory, { isSuccess: addCategoryIsSuccess }] =
    useAddcategoryMutation();

  const handleAddSubCategory = async () => {
    if (categoryName && parent.id) {
      await addCategory({ name: categoryName, parentId: parent.id });
    }
  };

  useEffect(() => {
    if (addCategoryIsSuccess) {
      triggerGetCategories({});
      handleEmptyParentSetAddSubCategoryFalse();
    }
  }, [addCategoryIsSuccess, triggerGetCategories]);

  const handleDeleteDialogbox = () => {
    setIsdeleteDialogOpen(true);
  };

  const [
    DeleteCategory,
    { isSuccess: DeleteCategoryIsSuccess, data: DeleteCategoryData },
  ] = useDeletecategoryMutation();

  const handleDeleteCategory = async () => {
    console.log(isDeleteCategory.id);
    await DeleteCategory({ id: isDeleteCategory.id });
  };

  useEffect(() => {
    if (DeleteCategoryIsSuccess) {
      console.log(DeleteCategoryData);
      triggerGetCategories({});
      handleEmptyisDeleteCategorySetIsdeleteDialogOpenFalse();
    }
  }, [DeleteCategoryIsSuccess, triggerGetCategories]);
  // console.log(isDeleteCategory);

  const handleEmptyisEditValSetisEditDialogOpenFalse = () => {
    setIsEditVal({ id: "", name: "" });
    setIsEditDialogOpen(false);
  };

  const [editCategory, { isSuccess: EditCategoryIsSuccess }] =
    useEditcategoryMutation();
  const handleEditCategory = async () => {
    await editCategory({ id: isEditVal.id, name: isEditVal.name });
  };

  useEffect(() => {
    if (EditCategoryIsSuccess) {
      triggerGetCategories({});
      handleEmptyisEditValSetisEditDialogOpenFalse();
      setIsEditVal({ id: "", name: "" });
    }
  }, [EditCategoryIsSuccess, triggerGetCategories]);

  return (
    <div className="w-full p-6 relative flex-1 h-full flex flex-col ">
      <p className="text-2xl font-semibold">Categories Admin</p>
      {categoriesIsLoading ? (
        <div className="w-full h-[70vh] grid place-content-center">
          <div className="pageloader"></div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-center gap-2 lg:gap-10 mt-10">
          {categories.map((category: Category) => (
            <div key={category.id}>
              <div className="flex gap-2 items-center">
                <p className="text-xl font-semibold underline">
                  {category.name}
                </p>
                <div
                  className="relative group"
                  onClick={() => {
                    setIsEditDialogOpen(true);
                    setIsEditVal({ id: category.id, name: category.name });
                  }}
                >
                  <CiEdit className="text-xl cursor-pointer" />
                  <div className="absolute  whitespace-nowrap bottom-full mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-black rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    Edit {category.name} category
                  </div>
                </div>
                <div className="relative group">
                  <IoIosAddCircleOutline
                    className="text-xl cursor-pointer"
                    onClick={() => {
                      setParent({ id: category.id, name: category.name });
                      setAddSubCategoryOpen(true);
                    }}
                  />
                  <div className="absolute whitespace-nowrap bottom-full mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-black rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    Add subcategory to {category.name}
                  </div>
                </div>
                <div className="relative group">
                  <AiOutlineDelete
                    className="text-xl cursor-pointer"
                    onClick={() => {
                      setIsDeleteCategory({
                        id: category.id,
                        name: category.name,
                      });
                      handleDeleteDialogbox();
                    }}
                  />
                  <div className="absolute whitespace-nowrap bottom-full right-full  mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-black rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    Delete {category.name} category
                  </div>
                </div>
              </div>
              <SubcategoryList
                categories={category.subcategories}
                setAddSubCategoryOpen={setAddSubCategoryOpen}
                setParent={setParent}
                handleDeleteDialogbox={handleDeleteDialogbox}
                setIsDeleteCategory={setIsDeleteCategory}
                setIsEditDialogOpen={setIsEditDialogOpen}
                setIsEditVal={setIsEditVal}
              />
            </div>
          ))}
        </div>
      )}

      {addSubCategoryOpen && (
        <Popbox
          isPopupOpen={addSubCategoryOpen}
          setIsPopupOpen={setAddSubCategoryOpen}
        >
          <div className="w-[35%] min-w-[300px] p-4 lg:p-6 bg-white rounded-md leading-tight flex flex-col gap-2 lg:gap-4">
            <div className="flex justify-between">
              <p className="text-lg lg:text-2xl font-semibold">
                Add SubCategory
              </p>
              <FaXmark
                className="cursor-pointer"
                onClick={handleEmptyParentSetAddSubCategoryFalse}
              />
            </div>
            <input
              type="text"
              placeholder="Name of the Category..."
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="border-2 border-black p-2 rounded-md"
              autoFocus
            />
            {categoryName && (
              <span className="text-md">
                Add <span className="font-semibold">{categoryName}</span> as a{" "}
                <span className="font-semibold">subcategory</span> of{" "}
                <span className="font-semibold">{parent.name}</span>
              </span>
            )}
            <div className="flex justify-between mt-4 lg:mt-8">
              <button
                className="p-2 px-3 bg-gray-300 rounded-md"
                onClick={handleEmptyParentSetAddSubCategoryFalse}
              >
                Cancel
              </button>
              <button
                className="p-2 px-3 bg-orange-400 rounded-md"
                onClick={handleAddSubCategory}
              >
                Submit
              </button>
            </div>
          </div>
        </Popbox>
      )}
      {isEditDialogOpen && (
        <Popbox
          isPopupOpen={isEditDialogOpen}
          setIsPopupOpen={setIsEditDialogOpen}
        >
          <div className="w-[35%] min-w-[300px] p-4 lg:p-6 bg-white rounded-md leading-tight flex flex-col gap-2 lg:gap-4">
            <div className="flex justify-between">
              <p className="text-lg lg:text-2xl font-semibold">Edit Category</p>
              <FaXmark
                className="cursor-pointer"
                onClick={handleEmptyisEditValSetisEditDialogOpenFalse}
              />
            </div>
            <input
              type="text"
              placeholder="Name of the Category..."
              value={isEditVal?.name}
              onChange={(e) =>
                setIsEditVal({ ...isEditVal, name: e.target.value })
              }
              className="border-2 border-black p-2 rounded-md"
              autoFocus
            />

            <div className="flex justify-between mt-4 lg:mt-8">
              <button
                className="p-2 px-3 bg-gray-300 rounded-md"
                onClick={handleEmptyisEditValSetisEditDialogOpenFalse}
              >
                Cancel
              </button>
              <button
                className="p-2 px-3 bg-orange-400 rounded-md"
                onClick={handleEditCategory}
              >
                Submit
              </button>
            </div>
          </div>
        </Popbox>
      )}
      {isdeleteDialogOpen && (
        <Popbox
          isPopupOpen={isdeleteDialogOpen}
          setIsPopupOpen={setIsdeleteDialogOpen}
        >
          <div className="w-[35%] min-w-[300px] p-4 lg:p-6 bg-white rounded-md leading-tight  flex flex-col gap-2 lg:gap-4">
            <div className="flex justify-between">
              <p className=" text-lg lg:text-2xl font-semibold">
                Delete Category
              </p>
              <FaXmark
                className="cursor-pointer"
                onClick={handleEmptyisDeleteCategorySetIsdeleteDialogOpenFalse}
              />
            </div>
            <span className="text-md">{isDeleteCategory.name}</span>

            <div className="flex justify-between mt-4 lg:mt-8">
              <button
                className="p-2 px-3 bg-gray-300 rounded-md"
                onClick={handleEmptyisDeleteCategorySetIsdeleteDialogOpenFalse}
              >
                Cancel
              </button>
              <button
                className="p-2 px-3 bg-orange-400 rounded-md"
                onClick={handleDeleteCategory}
              >
                Delete
              </button>
            </div>
          </div>
        </Popbox>
      )}
    </div>
  );
};

export default CategoriesAdmin;
