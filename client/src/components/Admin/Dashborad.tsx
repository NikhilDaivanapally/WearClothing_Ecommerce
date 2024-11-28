import { useDispatch, useSelector } from "react-redux";
import { Orders } from "./Admindata";
import { RootState } from "../../store/Store";

import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  UpdateAdminProductsCount,
  UpdateUsersCount,
} from "../../store/slices/adminSlice";
import {
  useGetTotalProductsCountQuery,
  useLazyGetUsersCountQuery,
} from "../../store/slices/apiSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  // users count
  const [
    triggerGetUsersCount,
    {
      isLoading: userCountIsLoading,
      isSuccess: userCountIsSuccess,
      data: userCountData,
    },
  ] = useLazyGetUsersCountQuery();

  useEffect(() => {
    if (userCountIsSuccess && userCountData?.data) {
      dispatch(UpdateUsersCount(userCountData?.data));
    }
  }, [userCountIsSuccess, userCountData?.data, dispatch]);

  useEffect(() => {
    triggerGetUsersCount({});
  }, []);

  // //  products count
  const {
    isLoading: ProductsCountIsLoading,
    isSuccess: ProductsCountIsSuccess,
    data: ProductsCountData,
  } = useGetTotalProductsCountQuery({});

  useEffect(() => {
    if (ProductsCountIsSuccess && ProductsCountData) {
      dispatch(UpdateAdminProductsCount(ProductsCountData?.data));
    }
  }, [ProductsCountIsSuccess, ProductsCountData?.data]);

  const DashboardData = () => {
    const { UsersCount } = useSelector((state: RootState) => state.admin.user);
    const { OrdersCount } = useSelector(
      (state: RootState) => state.admin.order
    );
    const { ProductsCount } = useSelector(
      (state: RootState) => state.admin.products
    );

    return [
      {
        name: "Renevue",
        loading: false,
        count: "$234,550",
        bgColor: "#FCF0E4",
        path: "/admin/Payments",
      },
      {
        name: "Products",
        loading: ProductsCountIsLoading,
        count: ProductsCount,
        bgColor: "#EDF5E8",
        path: "/admin/Products",
      },
      {
        name: "Orders",
        loading: false,
        count: OrdersCount,
        bgColor: "#EAF0FE",
        path: "/admin/Orders",
      },
      {
        name: "Users",
        loading: userCountIsLoading,
        count: UsersCount,
        bgColor: "#F6ECED",
        path: "/admin/Manage_Users",
      },
    ];
  };

  const Authuser: any = useSelector((state: RootState) => state.auth.user);
  return (
    <div className="w-full h-full relative  flex flex-col gap-6 ">
      {/* user detail */}
      <section className="flex justify-between">
        <div>
          <div>
            <p className="text-xl">
              Welcome Back,
              <span className="pl-1 font-semibold">
                {`${Authuser?.username
                  .slice(0, 1)
                  .toUpperCase()}${Authuser?.username.slice(1)}`}
              </span>
            </p>
            <span className="text-sm text-slate-600">
              Here's what happening with your store today
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue */}
        {DashboardData().map(({ name, loading, count, bgColor, path }, i) => {
          return (
            <div
              key={i}
              className={`p-4 flex flex-col gap-3 h-40  rounded-lg border-black`}
              style={{ backgroundColor: bgColor }}
            >
              <p className="text-md">{name}</p>
              {loading ? (
                <div className="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <p className="text-2xl ml-2 font-semibold">{count}</p>
              )}
              <Link
                to={`${path}`}
                className="text-sm mt-auto ml-auto border-b-[1px] border-black"
              >
                View All
              </Link>
            </div>
          );
        })}
      </section>

      <section className="w-full h-[200px] flex gap-8 flex-col lg:flex-row justify-between">
        <div className="flex-1 border-[1.5px] rounded-md p-2">
          <p className="text-md font-semibold py-1 border-b-[1.5px]">
            Recent Orders
          </p>
          <div className="w-full flex flex-col gap-3">
            <div className=" w-full grid grid-cols-5 gap-2">
              {["Product", "Customer", "Order ID", "Date", "Status"].map(
                (el) => (
                  <p key={el} className="text-sm font-semibold py-2">
                    {el}
                  </p>
                )
              )}
            </div>
            <ul className="w-full">
              {Orders.map(({ Product, Customer, orderId, status, Date }, i) => {
                return (
                  <li
                    key={i}
                    className="w-full mt-1 grid grid-cols-5 gap-2 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={Product?.img}
                        alt=""
                        className="h-[25px] object-contain rounded-sm"
                      />
                      <p className="overflow-hidden text-ellipsis whitespace-nowrap pr-1">
                        {Product?.name}
                      </p>
                    </div>
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {Customer}
                    </p>
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {orderId}
                    </p>
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {Date}
                    </p>
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {status}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="w-full lg:w-[300px] border-[1.5px] rounded-md p-2">
          <p className="text-md font-semibold py-1 border-b-[1.5px]">
            New Costumers
          </p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
