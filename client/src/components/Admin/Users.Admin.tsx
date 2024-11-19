import { CiSearch } from "react-icons/ci";
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
} from "react-icons/io";

import control from "../../assets/control.png";
import {
  useChangeUserRoleMutation,
  useDeleteUserMutation,
  useLazyGetUsersCountQuery,
  useLazyGetUsersQuery,
} from "../../store/slices/apiSlice";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { UpdateUsers, UpdateUsersCount } from "../../store/slices/adminSlice";
import { useLocation } from "react-router-dom";
import formatDate from "../../utils/formatDate";
import { FaUserMinus, FaXmark } from "react-icons/fa6";
import Popbox from "./PopBox/Popbox";
import Loader from "../Loaders/Loader";

const UsersAdmin = () => {
  interface queryInterface {
    page: number;
    sort: null | string;
    order: null | string;
  }
  interface user {
    id: string;
    username: string;
    role: string;
    email: string;
    createdAt: string;
    profileimage: string;
  }
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isRolePopupOpen, setIsRolePopupOpen] = useState(false);
  const [changeRole, setIsChangeRole] = useState<null | user>(null);
  const [updateRole, setUpdateRole] = useState<null | string>(null);

  const [removeUser, setIsRemoveUser] = useState<null | user>(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const UrledPage = searchParams.get("page");
  const UrledSort = searchParams.get("sort");
  const UrledOrder = searchParams.get("desc");
  const userPerpage = 5;

  const [query, setQuery] = useState<queryInterface>({
    page: Number(UrledPage) || 1,
    sort: UrledSort || "createdAt",
    order: UrledOrder || "desc",
  });

  const { UsersCount, Users } = useSelector(
    (state: RootState) => state.admin.user
  );

  useEffect(() => {
    changeRole?.id && setUpdateRole(changeRole?.role);
  }, [changeRole]);

  const [
    triggerGetUsers,
    { isSuccess: userIsSuccess, data: userData, isLoading: usersIsLoading },
  ] = useLazyGetUsersQuery();

  const [
    triggerGetUsersCount,
    { isSuccess: userCountIsSuccess, data: userCountData },
  ] = useLazyGetUsersCountQuery();

  useEffect(() => {
    triggerGetUsers(query);
  }, [query]);

  useEffect(() => {
    if (!usersIsLoading && userIsSuccess && userData?.data) {
      dispatch(UpdateUsers(userData?.data));
    }
  }, [userIsSuccess, userData?.data]);

  useEffect(() => {
    if (userCountIsSuccess && userCountData) {
      dispatch(UpdateUsersCount(userCountData?.data));
    }
  }, [userCountIsSuccess, userCountData]);

  const selectPageHandler = (selectedPage: number) => {
    if (
      selectedPage !== query.page &&
      selectedPage >= 1 &&
      selectedPage <= Math.ceil(UsersCount || 0 / userPerpage)
    ) {
      setQuery({ ...query, page: selectedPage });
      searchParams.set("page", String(selectedPage));

      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.pushState({}, "", newUrl);
      triggerGetUsers({ ...query, page: selectedPage });
    }
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value }));
  };

  const [
    DeleteUser,
    {
      isLoading: DeleteUserIsLoading,
      isSuccess: DeleteIsSuccess,
      data: DeleteData,
    },
  ] = useDeleteUserMutation();

  const [
    ChangeRole,
    {
      isLoading: ChangeRoleIsLoading,
      isSuccess: ChangeRoleSuccess,
      data: ChangeRoleData,
    },
  ] = useChangeUserRoleMutation();
  const handleChangeUserRole = async () => {
    if (changeRole?.role !== updateRole) {
      await ChangeRole({ id: changeRole?.id, role: updateRole });
    }
  };

  const handleDeleteUser = async (id: string) => {
    await DeleteUser({ id });
  };

  useEffect(() => {
    if (DeleteIsSuccess && DeleteData) {
      triggerGetUsers(query);
      triggerGetUsersCount({});
      setIsPopupOpen(false);
    }
  }, [DeleteIsSuccess]);

  useEffect(() => {
    if (ChangeRoleData && ChangeRoleSuccess) {
      triggerGetUsers(query);
      triggerGetUsersCount({});
      setIsRolePopupOpen(false);
    }
  }, [ChangeRoleSuccess]);

  const handleEmptyRemoveUsersetIsPopupOpenFalse = () => {
    setIsPopupOpen(false);
    setIsRemoveUser(null);
  };

  const handleEmptyChangeRolesetIsRolePopupOpenFalse = () => {
    setIsRolePopupOpen(false);
    setIsChangeRole(null);
    setUpdateRole(null);
  };

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      // Check for Ctrl + K (event.ctrlKey && event.key === "k")
      if (event.ctrlKey && event.key == "k") {
        event.preventDefault(); // Prevent the browser default Ctrl + K behavior
        setIsSearchOpen((prev) => !prev); // Open the search box/modal
      }

      // Close the search box on Escape
      if (event.key === "Escape") {
        setIsSearchOpen(false); // Close the search box/modal
      }
    };

    // Attach the keydown event listener
    window.addEventListener("keydown", handleKeydown);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    <div className="w-full relative flex-1 h-screen overflow-auto flex flex-col ">
      {/* search   */}
      {isSearchOpen && (
        <div
          className="parentContainer absolute inset-0 bg-[rgba(0,0,0,0.4)]"
          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            const target = e.target as HTMLElement; // Cast target to HTMLElement
            if (target.classList.contains("parentContainer")) {
              setIsSearchOpen((prev) => !prev);
            }
          }}
        >
          <div className="bg-gray-200 w-[300px] h-12 absolute left-1/2 top-20 -translate-x-1/2  p-2 rounded-md flex items-center gap-2">
            <CiSearch className="text-2xl" />
            <input
              type="text"
              className="bg-transparent flex-1 outline-none"
              placeholder="Search ..."
              autoFocus
            />
            <button
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className="bg-gray-400 rounded-md px-2 py-1"
            >
              Esc
            </button>
          </div>
        </div>
      )}

      {isPopupOpen && (
        <Popbox isPopupOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen}>
          <div className="w-[35%] min-w-[300px] p-4 lg:p-6 bg-white rounded-md leading-tight  flex flex-col gap-2 lg:gap-4">
            <div className="flex justify-between">
              <p className=" text-lg lg:text-2xl font-semibold">
                Remove account
              </p>
              <FaXmark
                className="cursor-pointer"
                onClick={handleEmptyRemoveUsersetIsPopupOpenFalse}
              />
            </div>
            <span className="text-md">
              The account and its associated data will by permanently removed &
              it cannot be recovered back{" "}
            </span>
            <div className="flex items-center gap-4">
              <img
                src={removeUser?.profileimage}
                alt=""
                className="w-10 h-10 rounded-md"
              />
              <div>
                {removeUser?.username && <p>{removeUser.username}</p>}
                {removeUser?.email && <p>{removeUser.email}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 lg:mt-8">
              <button
                className="h-10 px-3 bg-gray-300 rounded-md"
                onClick={handleEmptyRemoveUsersetIsPopupOpenFalse}
              >
                Cancel
              </button>
              <button
                className="h-10 px-3 bg-orange-400 rounded-md"
                onClick={() =>
                  removeUser?.id && handleDeleteUser(removeUser.id)
                }
              >
                {DeleteUserIsLoading ? <Loader color="black" /> : "Remove"}
              </button>
            </div>
          </div>
        </Popbox>
      )}

      {isRolePopupOpen && (
        <Popbox
          isPopupOpen={isRolePopupOpen}
          setIsPopupOpen={setIsRolePopupOpen}
        >
          <div className="w-[35%] min-w-[300px] p-4 lg:p-6 bg-white rounded-md leading-tight  flex flex-col gap-2 lg:gap-4">
            <div className="flex justify-between">
              <p className=" text-lg lg:text-2xl font-semibold">
                Change team member role
              </p>
              <FaXmark
                className="cursor-pointer"
                onClick={handleEmptyChangeRolesetIsRolePopupOpenFalse}
              />
            </div>
            <span className="text-md">
              Changing user's role changes their access
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <img
                src={changeRole?.profileimage}
                alt=""
                className="w-10 h-10 rounded-md"
              />
              <div>
                {changeRole?.username && <p>{changeRole.username}</p>}
                {changeRole?.email && <p>{changeRole.email}</p>}
              </div>
              <select
                name="role"
                className="w-fit p-2 border-2 rounded-md ml-auto"
                defaultValue={changeRole?.role}
                onChange={(e) => setUpdateRole(e.target.value)}
              >
                {["Admin", "user"].map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between mt-4 lg:mt-8">
              <button
                className="h-10 px-3 bg-gray-300 rounded-md"
                onClick={handleEmptyChangeRolesetIsRolePopupOpenFalse}
              >
                Cancel
              </button>
              <button
                className={`h-10 px-3 bg-orange-400 rounded-md ${
                  changeRole?.role == updateRole
                    ? "cursor-not-allowed opacity-[0.7]"
                    : ""
                }`}
                onClick={() => changeRole?.id && handleChangeUserRole()}
              >
                {!!ChangeRoleIsLoading ? <Loader color="black" /> : "Submit"}
              </button>
            </div>
          </div>
        </Popbox>
      )}

      <p className="text-sm">Manage members access</p>
      <div className="flex flex-col md:flex-row justify-between">
        <p className="text-lg md:text-2xl font-semibold">Members</p>
        <div className="flex self-end gap-3 items-center">
          <p>{UsersCount ? UsersCount : 0} members</p>
          <div
            className="flex gap-2 items-center p-2 bg-gray-200 rounded-md  cursor-pointer"
            onClick={() => setIsSearchOpen((prev) => !prev)}
          >
            <CiSearch className="text-lg " />
            <p className="bg-transparent flex-1 w-36 outline-none cursor-pointer ">
              Search ...
            </p>
            <span className="text-sm flex items-center">
              <img className="h-4" src={control} alt="" />K
            </span>
          </div>
        </div>
      </div>

      {/* sort & order */}
      <div className="flex justify-end mt-2 gap-3 md:gap-8">
        <div className="flex items-center gap-2">
          <p className="font-semibold">Sort :</p>
          <select
            name="sort"
            className="w-fit p-2 border-2 rounded-md"
            onChange={handleSelect}
            value={query.sort || "createdAt"}
          >
            <option value="createdAt">createdAt</option>
            <option value="role">role</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <p className="font-semibold">Order :</p>
          <select
            name="order"
            className="w-fit p-2 border-2 rounded-md"
            onChange={handleSelect}
            value={query.order || "desc"}
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>

      {/* UsersList */}
      <div className="flex-1 w-full">
        <div className="grid grid-cols-5 gap-1 text-sm md:text-lg font-semibold border-b-[1.5px] border-gray-200">
          <div className="py-4 text-center">Image</div>
          <div className="py-4 text-center">UserName</div>
          <div className="py-4 text-center">Email</div>
          <div className="py-4 text-center whitespace-nowrap">Created At</div>
          <div className="py-4 text-center">Role</div>
        </div>
        {usersIsLoading ? (
          <div className="w-full h-[60vh] grid place-content-center">
            <div className="pageloader"></div>
          </div>
        ) : Users.length ? (
          Users?.map((el: user, index: number) => {
            const date = formatDate(String(el.createdAt));
            return (
              <div
                key={index}
                className="grid grid-cols-5 gap-2 text-sm md:text-[16px] text-center items-center my-2"
              >
                <img
                  src={el.profileimage}
                  className="w-10 h-10 rounded-md  mx-auto"
                ></img>
                <p className="break-words">{el.username}</p>
                <p className="break-words">{el.email}</p>
                <p className="break-words ">{date}</p>
                <div className="flex flex-col md:flex-row justify-end items-center gap-0 md:gap-3">
                  <button
                    className="p-1 md:p-2  flex gap-2 justify-center items-center select-none border-2 rounded-md"
                    onClick={() => {
                      setIsRolePopupOpen(true);
                      setIsChangeRole(el);
                    }}
                  >
                    {el.role}
                    <IoIosArrowDown />
                  </button>
                  <button
                    onClick={() => {
                      setIsPopupOpen(true);
                      setIsRemoveUser(el);
                    }}
                    className="text-lg cursor-pointer   border-2 border-transparent rounded-md  p-2  hover:text-orange-400 hover:border-gray-200 hover:bg-orange-100"
                  >
                    <FaUserMinus />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full h-[60vh] grid place-content-center">
            <p className="font-semibold text-lg">No Users Found</p>
          </div>
        )}
      </div>

      {/* pagination */}
      {UsersCount && UsersCount > 0 ? (
        <div className="pagination flex items-center justify-center gap-4 text-black">
          <span
            className={`text-2xl select-none hover:border-2 cursor-pointer w-8 h-8 rounded-full grid place-content-center
              ${query.page > 1 ? "" : "opacity-0"}`}
            onClick={() => selectPageHandler(query.page - 1)}
          >
            <IoIosArrowBack />
          </span>
          {UsersCount > userPerpage &&
            [...Array(Math.ceil(UsersCount / userPerpage))].map((_, i) => (
              <p
                key={i}
                onClick={() => selectPageHandler(i + 1)}
                className={`hover:border-2 select-none cursor-pointer w-8 h-8 rounded-full grid place-content-center ${
                  query.page === i + 1 ? "bg-black text-white" : ""
                }`}
              >
                {i + 1}
              </p>
            ))}

          <span
            className={`text-2xl hover:border-2 select-none cursor-pointer w-8 h-8 rounded-full grid place-content-center
              ${
                query.page < Math.ceil(UsersCount / userPerpage)
                  ? ""
                  : "opacity-0"
              }`}
            onClick={() => selectPageHandler(query.page + 1)}
          >
            <IoIosArrowForward />
          </span>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default UsersAdmin;
