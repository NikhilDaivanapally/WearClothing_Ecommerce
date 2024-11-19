import { Outlet } from "react-router-dom";
import Sidemenubar from "../../components/Admin/Sidemenubar";
import { useDispatch, useSelector } from "react-redux";
import { UpdateAdminMenuOpen } from "../../store/slices/adminSlice";
import { RootState } from "../../store/Store";

const Admin = () => {
  const dispatch = useDispatch();

  const { isAdminMenuOpen } = useSelector((state: RootState) => state.admin);

  const handleAdminMenu = () => {
    dispatch(UpdateAdminMenuOpen(!isAdminMenuOpen));
  };
  return (
    <div className="w-full h-full flex flex-col lg:flex-row overflow-hidden">
      <div
        className={`sticky z-30 ml-6 mt-4  w-9 h-9  lg:hidden bg-transparent  rounded-sm  cursor-pointer flex  transition-all
  after:transition-all after:duration-200 after:ease-[cubic-bezier(0.22, 1, 0.36, 1)] after:content-[''] after:w-7 after:h-[1.5px] after:rounded-full after:bg-gray-400 after:absolute after:left-1/2 after:-translate-x-1/2 
  ${isAdminMenuOpen ? "after:top-1/2 after:rotate-45" : "after:top-1/3"}
  before:transition-all before:duration-200 before:ease-[cubic-bezier(0.22, 1, 0.36, 1)] before:content-[''] before:w-7 before:h-[1.5px] before:rounded-full before:bg-gray-400 before:absolute before:left-1/2 before:-translate-x-1/2
  ${isAdminMenuOpen ? "before:top-1/2 before:-rotate-45" : "before:top-2/3"}
  `}
        onClick={handleAdminMenu}
      ></div>
      {isAdminMenuOpen && (
        <div
          onClick={handleAdminMenu}
          className="fixed z-10 inset-0 bg-[rgba(0,0,0,0.3)]"
        ></div>
      )}

      <Sidemenubar />
      <div className="flex-1 p-5 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
