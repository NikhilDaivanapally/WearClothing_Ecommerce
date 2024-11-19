export interface Category {
  id: string;
  name: string;
  subcategories?: Category[]; // Subcategories are optional
}

export interface CategoryListProps {
  categories: Category[]; // An array of Category objects
}

export interface SubCategoryProps {
  categories: Category[] | null;
  path: String; // An array of Category objects
}

export interface product {
  id: string;
  brand: string;
  name: string;
  price: string;
  sizes: any;
  material: string;
  size: string;
  fit: string;
  washcare: string;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  UserId: string | null;
  images: string[];
}

export interface queryInterface {
  page: number;
  sort: string;
  order: string;
  minPrice: string | number;
  maxPrice: string | number;
  brands: string[] | undefined;
}

export interface price {
  min: number;
  max: number;
}
