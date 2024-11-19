interface Category {
  id: string;
  name: string;
  subcategories?: Category[]; // Subcategories are optional
}

interface CategoriesWiseSubCategories {
  Mens: { id: string; name: string }[] | any[];
  Kids: { id: string; name: string }[] | any[];
  Womens: { id: string; name: string }[] | any[];
}

const getId = (categories: Category[], val: string, Gender: string) => {
  const CategoriesWiseSubCategories: CategoriesWiseSubCategories | any = {
    Mens: [],
    Kids: [],
    Womens: [],
  };

  // Recursive function to traverse and collect subcategory IDs
  const getIds = (categories: Category[], name: string) => {
    categories.forEach((el: Category) => {
      if (el?.subcategories?.length) {
        getIds(el.subcategories, name);
      } else {
        if (CategoriesWiseSubCategories[name]) {
          CategoriesWiseSubCategories[name].push({ id: el.id, name: el.name });
        }
      }
    });
  };

  // Start populating SubCategoriesArray
  categories.forEach((el: Category) => {
    getIds(el.subcategories || [], el.name);
  });

  // Find the ID by matching the name (case-insensitive)
  const result = CategoriesWiseSubCategories[Gender].find(
    (el: any) => el.name.toLowerCase() === val.toLowerCase()
  );

  return result?.id;
};

export { getId };
