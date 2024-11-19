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

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "mens",
          element: <Mens />,
        },
        {
          path: "mens/:subcategory",
          element: (
            <>
              <Outlet />
            </>
          ),
          children: [
            {
              index: true,
              element: <Products />,
            },
            {
              path: ":subsubcategory",
              element: <Products />,
            },
            {
              path: ":subsubcategory/:id",
              element: <BuyProduct />,
            },
          ],
        },
        {
          path: "womens",
          element: <Womens />,
        },
        {
          path: "womens/:subcategory",
          element: (
            <>
              <Outlet />
            </>
          ),
          children: [
            {
              index: true,
              element: <Products />,
            },
            {
              path: ":subsubcategory",
              element: <Products />,
            },
            {
              path: ":subsubcategory/:id",
              element: <BuyProduct />,
            },
          ],
        },
        {
          path: "kids",
          element: <Kids />,
        },
        {
          path: "kids/:subcategory",
          element: (
            <>
              <Outlet />
            </>
          ),
          children: [
            {
              index: true,
              element: <Products />,
            },
            {
              path: ":subsubcategory",
              element: <Products />,
            },
            {
              path: ":subsubcategory/:id",
              element: <BuyProduct />,
            },
          ],
        },

        {
          path: "/search/:q",
          element: <SearchResult />,
        },
        {
          path: "account/register",
          element: <Signup />,
        },
        {
          path: "account/login",
          element: <Signin />,
        },
        {
          path: "account/forgotpassword",
          element: <Forgotpassword />,
        },

        {
          path: "wishlist",
          element: <Wishlist />,
        },
        {
          path: "cart",
          element: <Cart />,
        },
        {
          path: "profile",
          element: <Profile />,
        },

        {
          path: "*",
          element: <Page404 />,
        },
      ],
    },
    {
      path: "/search",
      element: <Search />,
    },
    {
      path: "/account/reset-password",
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
        {
          path: "/admin/Dashboard",
          element: <Dashboard />,
        },
        {
          path: "/admin/Products",
          element: <ProductsAdmin />,
        },
        {
          path: "/admin/Orders",
          element: <OrdersAdmin />,
        },
        {
          path: "/admin/Payments",
          element: <PaymentsAdmin />,
        },
        {
          path: "/admin/Settings",
          element: <SettingsAdmin />,
        },
        {
          path: "/admin/Manage_Users",
          element: <UsersAdmin />,
        },
        {
          path: "/admin/Manage_Categories",
          element: <CategoriesAdmin />,
        },
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
        {
          path: "All",
          element: <AdminProducts />,
        },
        {
          path: "edit/:id",
          element: <EditProductPage />,
        },
      ],
    },
  ]);

  return (
    <div className="App select-none font-['gilroy']">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
