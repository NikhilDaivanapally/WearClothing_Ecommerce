import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Search: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [search, setSearch] = useState("");
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Navigate(`/search/${search}?q=${search.toString()}`);
  };
  const Navigate = useNavigate();
  return (
    <div className="w-full h-screen">
      {/* search bar */}
      <form
        className="flex w-full items-center gap-4 md:gap-8 p-5  md:p-8"
        onSubmit={handleSearch}
      >
        <FaArrowLeft
          className="text-xl md:text-2xl cursor-pointer"
          onClick={() => Navigate("/")}
        />
        <input
          className="flex-1 text-lg md:text-xl outline-none"
          type="text"
          autoFocus
          placeholder="Search for brands & products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <CiSearch className="text-xl md:text-2xl cursor-pointer" />
      </form>
    </div>
  );
};

export default Search;
