import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home.page";
import Signup from "./pages/Auth/Singup.page";
import Signin from "./pages/Auth/Signin.page";
import Page404 from "./pages/Page404.page";
import RootLayout from "./pages/RootLayout/RootLayout.page";
import Mens from "./pages/Mens.page";
import Womens from "./pages/Womens.page";
import Kids from "./pages/Kids.page";
import Search from "./pages/Search.page";
import Products from "./pages/Products.page";
import Admin from "./pages/Admin/Admin.page";
import AuthGuard from "./AuthGuard";
import Dashboard from "./components/Admin/Dashborad";
import ProductsAdmin from "./components/Admin/Products.Admin";
import OrdersAdmin from "./components/Admin/Orders.Admin";
import SettingsAdmin from "./components/Admin/Settings.Admin";
import UsersAdmin from "./components/Admin/Users.Admin";
import CategoriesAdmin from "./components/Admin/Categories.Admin";
import PaymentsAdmin from "./components/Admin/Payments.Admin";
import Wishlist from "./pages/Wishlist.page";
import Cart from "./pages/Cart.page";
import BuyProduct from "./pages/BuyProduct.page";
import Profile from "./pages/Profile.page";
import Forgotpassword from "./pages/Auth/Forgotpassword.page";
import ResetPassword from "./pages/Auth/ResetPassword.page";
import SearchResult from "./pages/SearchResult.page";
import AdminProducts from "./pages/AdminProducts.pgae";
import EditProductPage from "./pages/EditProductPage";
import { useLazySuccessQuery } from "./store/slices/apiSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { UpdateAuthState } from "./store/slices/authSlice";
import { UpdateCart } from "./store/slices/cartItemSlice";
import { UpdateWishlist } from "./store/slices/wishlistSlice";

function App() {
  const dispatch = useDispatch();
  const [me, { isSuccess, isLoading, data }] = useLazySuccessQuery({});

  useEffect(() => {
    me({});
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(UpdateAuthState(data?.data?.user));
      dispatch(UpdateCart(data?.data?.cart));
      dispatch(UpdateWishlist(data?.data?.wishlist));
      console.log(data);
    }
  }, [isSuccess, data]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "mens",
          element: <Outlet />,
          children: [
            { index: true, element: <Mens /> },
            { path: ":subsubcategory", element: <Products /> },
            { path: ":subsubcategory/:id", element: <BuyProduct /> },
          ],
        },
        {
          path: "womens",
          element: <Outlet />,
          children: [
            { index: true, element: <Womens /> },
            { path: ":subsubcategory", element: <Products /> },
            { path: ":subsubcategory/:id", element: <BuyProduct /> },
          ],
        },
        {
          path: "kids",
          element: <Outlet />,
          children: [
            { index: true, element: <Kids /> },
            { path: ":subsubcategory", element: <Products /> },
            { path: ":subsubcategory/:id", element: <BuyProduct /> },
          ],
        },
        { path: "search/:q", element: <SearchResult /> },
        { path: "/register", element: <Signup /> },
        { path: "/login", element: <Signin /> },
        { path: "/forgotpassword", element: <Forgotpassword /> },
        { path: "wishlist", element: <Wishlist /> },
        { path: "cart", element: <Cart /> },
        { path: "profile", element: <Profile /> },
      ],
    },
    {
      path: "/search",
      element: <Search />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
    {
      path: "/admin",
      element: (
        <AuthGuard>
          <Admin />
        </AuthGuard>
      ),
      children: [
        { path: "Dashboard", element: <Dashboard /> },
        { path: "Products", element: <ProductsAdmin /> },
        { path: "Orders", element: <OrdersAdmin /> },
        { path: "Payments", element: <PaymentsAdmin /> },
        { path: "Settings", element: <SettingsAdmin /> },
        { path: "Manage_Users", element: <UsersAdmin /> },
        { path: "Manage_Categories", element: <CategoriesAdmin /> },
      ],
    },
    {
      path: "/admin/products",
      element: (
        <AuthGuard>
          <Outlet />
        </AuthGuard>
      ),
      children: [
        { path: "All", element: <AdminProducts /> },
        { path: "edit/:id", element: <EditProductPage /> },
      ],
    },
    { path: "*", element: <Page404 /> },

    {
      path: "/pagenotfound",
      element: <Page404 />,
    },
  ]);

  return (
    <div className="App select-none font-gilroy">
      {isLoading ? (
        <div className="fixed inset-0">
          <div className="p-6 w-full h-full  flex items-center justify-center">
            <div className="pageloader"></div>
          </div>
        </div>
      ) : (
        <RouterProvider router={router} />
      )}
    </div>
  );
}

export default App;
