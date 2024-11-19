import { createSlice } from "@reduxjs/toolkit";
import { product } from "../../TsInterfaces/Interfaces";

interface userInterface {
  UsersCount: number;
  Users: any[];
}

interface productsInterface {
  ProductsCount: number;
  Products: product[];
}

interface orderInterface {
  OrdersCount: number;
  Orders: any[];
}

interface ProductInfoInterface {
  Brand: string;
  name: string;
  price: string;
  material: string;
  size: string;
  fit: string;
  washcare: string;
  sizes: any;
  images: string[];
}

interface AddProductInterface {
  isActive: boolean;
  CategoryInfo: {
    Category: any;
    subCategory: any;
    subsubCategory: any;
  };
  ProductInfo: ProductInfoInterface;
  ProductPreviewImageUrls: string[];
  isComplete: boolean;
}

interface DeleteProductInterface {
  isActive: boolean;
  ProductInfo: product | null;
}

interface adminInterface {
  ActiveField: string;
  isAdminMenuOpen: boolean;
  user: userInterface;
  order: orderInterface;
  AddProduct: AddProductInterface;
  products: productsInterface;
  DeleteProduct: DeleteProductInterface;
}
const initialState:adminInterface = {
  ActiveField:
    window.location.href.split("/").reverse()[0].toString() || "Dashboard",
  isAdminMenuOpen: false,
  user: {
    UsersCount: 0,
    Users: [],
  },
  order: {
    OrdersCount: 0,
    Orders: [],
  },
  products: {
    ProductsCount: 0,
    Products: [],
  },
  AddProduct: {
    isActive: false,
    CategoryInfo: {
      Category: null,
      subCategory: null,
      subsubCategory: null,
    },
    ProductInfo: {
      Brand: "",
      name: "",
      price: "",
      material: "",
      size: "",
      fit: "",
      washcare: "",
      sizes: { S: "", M: "", L: "", XL: "", XXL: "" },
      images: [],
    },
    ProductPreviewImageUrls: [],
    isComplete: false,
  },
  DeleteProduct: {
    isActive: false,
    ProductInfo: null,
  },
};

const slice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    UpdateActiveField(state, action) {
      state.ActiveField = action.payload;
    },
    UpdateDeleteProductIsActive(state, action) {
      state.DeleteProduct.isActive = action.payload;
    },
    UpdateDeleteProductInfo(state, action) {
      state.DeleteProduct.ProductInfo = action.payload;
    },
    UpdateUsersCount(state, action) {
      state.user.UsersCount = action.payload;
    },
    UpdateUsers(state, action) {
      state.user.Users = action.payload;
    },
    UpdateCategory(state, action) {
      state.AddProduct.CategoryInfo.Category = action.payload;
    },
    UpdateSubCategory(state, action) {
      state.AddProduct.CategoryInfo.subCategory = action.payload;
    },
    UpdateSubSubCategory(state, action) {
      state.AddProduct.CategoryInfo.subsubCategory = action.payload;
    },
    UpdateProductInfo(state, action) {
      state.AddProduct.ProductInfo = action.payload;
    },
    UpdateProductPreviewImageUrls(state, action) {
      state.AddProduct.ProductPreviewImageUrls = action.payload;
    },
    UpdateAdminMenuOpen(state, action) {
      state.isAdminMenuOpen = action.payload;
    },
    UpdateCategoryInfo(state, action) {
      state.AddProduct.CategoryInfo = action.payload;
    },
    UpdateAdminProductsCount(state, action) {
      state.products.ProductsCount = action.payload;
    },
    UpdateAddProductIsActive(state, action) {
      state.AddProduct.isActive = action.payload;
    },
    UpdateAddProductIsCompelete(state, action) {
      state.AddProduct.isComplete = action.payload;
    },
  },
});
export const {
  UpdateCategoryInfo,
  UpdateActiveField,
  UpdateUsersCount,
  UpdateUsers,
  UpdateCategory,
  UpdateSubCategory,
  UpdateSubSubCategory,
  UpdateProductInfo,
  UpdateAddProductIsActive,
  UpdateAddProductIsCompelete,
  UpdateProductPreviewImageUrls,
  UpdateAdminMenuOpen,
  UpdateAdminProductsCount,
  UpdateDeleteProductInfo,
  UpdateDeleteProductIsActive,
} = slice.actions;

export default slice.reducer;
