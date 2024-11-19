import Loader from "./Loader";

const FilterLoader = () => {
  return (
    <div className="w-full fixed top-0 left-0 z-30 h-full bg-[rgba(0,0,0,0.7)] grid place-content-center">
      <Loader />
    </div>
  );
};

export default FilterLoader;
