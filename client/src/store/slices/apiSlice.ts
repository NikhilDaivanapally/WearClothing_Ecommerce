import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://wearclothing.vercel.app/api/v1",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // auth

    Signup: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.query({
      query: () => "auth/logout",
      keepUnusedDataFor: 2,
    }),
    success: builder.query({
      query: () => "/auth/login/success",
      keepUnusedDataFor: 2, // cache duration in seconds
    }),
    forgotpass: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetpass: builder.mutation({
      query: (data) => ({
        url: `auth/reset-password?`,
        method: "POST",
        body: data.body,
        params: data.params,
      }),
    }),

    // users

    getUsers: builder.query({
      query: ({ page, sort, order }) => ({
        url: "/users",
        params: { page, sort, order },
      }),
      keepUnusedDataFor: 2,
    }),
    getUsersCount: builder.query({
      query: () => "/users/count",
      keepUnusedDataFor: 2,
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
    }),
    changeUserRole: builder.mutation({
      query: (data) => ({
        url: `/users/changerole`,
        method: "PUT",
        body: data,
      }),
    }),

    // categories

    getCategories: builder.query({
      query: () => "/categories",
      keepUnusedDataFor: 2, // cache duration in seconds
    }),
    getSubcategories: builder.query({
      query: (data) => ({
        url: "/categories/subcategories",
        params: data,
      }),
    }),
    addcategory: builder.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
    }),
    deletecategory: builder.mutation({
      query: ({ id }) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
    }),
    editcategory: builder.mutation({
      query: ({ id, name }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: { name },
      }),
    }),

    // products
    getProductsAndCount: builder.query({
      query: (data) => ({
        url: "/products",
        params: data,
      }),
    }),

    getBrandsAndPricerange: builder.query({
      query: (data) => ({
        url: "/products/metadata",
        params: data,
      }),
    }),

    getProductById: builder.query({
      query: ({ id }) => ({
        url: `/products/${id}`,
      }),
    }),

    getAdminProductsAndCount: builder.query({
      query: (data) => ({
        url: "/products/admin",
        params: data,
      }),
    }),

    getAdminBrandsAndPrices: builder.query({
      query: (data) => ({
        url: "/products/admin/metadata",
        params: data,
      }),
    }),

    // add product
    addProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
    }),
    // update product
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    // delete product
    deleteProduct: builder.mutation({
      query: ({ id }) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
    }),

    // search Products

    searchProductsAndCount: builder.query({
      query: (data) => ({
        url: "/products/search",
        params: data,
      }),
    }),
    searchBrandsAndPricerange: builder.query({
      query: (data) => ({
        url: "/products/search/metadata",
        params: data,
      }),
    }),

    getNewArrivals: builder.query({
      query: (data) => ({
        url: "/products/newArrivals",
        params: data,
      }),
    }),

    getTotalProductsCount: builder.query({
      query: () => ({
        url: "/products/totalProductsCount",
      }),
    }),

    // wishlist

    getWishlist: builder.query({
      query: () => "/wishlist",
      keepUnusedDataFor: 2,
    }),
    addProductToWishlist: builder.mutation({
      query: (data) => ({
        url: "/wishlist",
        method: "POST",
        body: data,
      }),
    }),
    removeProductFromWishlist: builder.mutation({
      query: ({ id, wishlistId }) => ({
        url: `/wishlist/${id}`,
        method: "DELETE",
        body: { wishlistId },
      }),
    }),

    // cart
    getCart: builder.query({
      query: () => "/cart",
      keepUnusedDataFor: 2,
    }),
    addProductToBag: builder.mutation({
      query: (data) => ({
        url: "/cart",
        method: "POST",
        body: data,
      }),
    }),
    updateCartitem: builder.mutation({
      query: ({ cartItemId, size, quantity }) => ({
        url: `/cart/${cartItemId}`,
        method: "PUT",
        body: { size, quantity },
      }),
    }),
    removeProductFromBag: builder.mutation({
      query: ({ id, cartId }) => ({
        url: `/cart/${id}`,
        method: "DELETE",
        body: { cartId },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLazyGetNewArrivalsQuery,
  useLazySuccessQuery,
  useLazyGetSubcategoriesQuery,
  useGetTotalProductsCountQuery,
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
  useLazyLogoutQuery,

  useLazyGetUsersQuery,
  useLazySearchProductsAndCountQuery,
  useLazySearchBrandsAndPricerangeQuery,
  useForgotpassMutation,
  useResetpassMutation,
  useDeleteUserMutation,
  useLazyGetUsersCountQuery,
  useChangeUserRoleMutation,
  useAddcategoryMutation,
  useDeletecategoryMutation,
  useEditcategoryMutation,
  useAddProductMutation,
  useLazyGetWishlistQuery,
  useLazyGetCartQuery,
  useLazyGetBrandsAndPricerangeQuery,
  useLazyGetProductsAndCountQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddProductToWishlistMutation,
  useRemoveProductFromWishlistMutation,
  useGetProductByIdQuery,
  useAddProductToBagMutation,
  useRemoveProductFromBagMutation,
  useUpdateCartitemMutation,
  useLazyGetAdminBrandsAndPricesQuery,
  useLazyGetAdminProductsAndCountQuery,
} = apiSlice;
