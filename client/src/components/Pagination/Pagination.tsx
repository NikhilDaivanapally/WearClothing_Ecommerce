import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { productsPerPage } from "../../constants";

const Pagination: React.FC<{
  query: any;
  setQuery: React.Dispatch<any>;
  ProductsCount: any;
}> = ({ query, setQuery, ProductsCount }) => {
  // select page handler
  const handleSelectPage = (selectedPage: number) => {
    if (
      selectedPage !== query.page &&
      selectedPage >= 1 &&
      selectedPage <= Math.ceil(ProductsCount || 0 / productsPerPage)
    ) {
      const updatedSearchParams = new URLSearchParams(window.location.search);
      updatedSearchParams.set("page", String(selectedPage));
      const newUrl = !updatedSearchParams.toString().length
        ? window.location.pathname
        : `${window.location.pathname}?${updatedSearchParams.toString()}`;
      window.history.pushState({}, "", newUrl);
      setQuery({ ...query, page: selectedPage });
    }
  };

  return (
    <div className="pagination flex items-center justify-center gap-4 text-black">
      <span
        className={`text-2xl select-none hover:border-2 cursor-pointer w-8 h-8 rounded-full grid place-content-center
              ${query.page > 1 ? "" : "opacity-0"}`}
        onClick={() => handleSelectPage(query.page - 1)}
      >
        <IoIosArrowBack />
      </span>
      {ProductsCount > productsPerPage &&
        [...Array(Math.ceil(ProductsCount / productsPerPage))].map((_, i) => (
          <p
            key={i}
            onClick={() => handleSelectPage(i + 1)}
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
                query.page < Math.ceil(ProductsCount / productsPerPage)
                  ? ""
                  : "opacity-0"
              }`}
        onClick={() => handleSelectPage(query.page + 1)}
      >
        <IoIosArrowForward />
      </span>
    </div>
  );
};

export default Pagination;
