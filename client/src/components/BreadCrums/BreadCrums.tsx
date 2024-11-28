import { Link, useLocation } from "react-router-dom";

const BreadCrums = () => {
  const path = useLocation();
  let breadcrums = path.pathname.split("/").filter((el) => el);
  return (
    <div className="breadcrums hidden md:flex gap-2 flex-wrap bg-white">
      {breadcrums.length && (
        <Link to={"/"} className="text-gray-400">
          Home
        </Link>
      )}
      <div>/</div>
      {breadcrums.length &&
        breadcrums?.map((el, index) => {
          let element = "";
          for (let i = 0; i <= index; i++) {
            element += `${
              i == index ? `${breadcrums[i]}` : `${breadcrums[i]}/`
            }`;
          }
          if (index === breadcrums.length - 1) {
            return (
              <span key={index}>{el.toString().split("%20").join("_")}</span>
            );
          } else {
            return (
              <div key={index} className="flex gap-2">
                <Link to={`/${element}`} className="text-gray-400">
                  {el.toString().split("%20").join("_")}
                </Link>
                <span>/</span>
              </div>
            );
          }
        })}
    </div>
  );
};

export default BreadCrums;
