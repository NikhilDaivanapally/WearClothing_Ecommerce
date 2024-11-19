import { queryInterface } from "./TsInterfaces/Interfaces";

const productsPerPage = 8;

const { search } = window.location;
const searchParams = new URLSearchParams(search);
const intitalquery: queryInterface = {
  page: Number(searchParams.get("page")) || 1,
  sort: searchParams.get("sort") || "createdAt",
  order: searchParams.get("order") || "DESC",
  minPrice: Number(searchParams.get("minPrice")) || "",
  maxPrice: Number(searchParams.get("maxPrice")) || "",
  brands:
    searchParams
      .get("brands")
      ?.split(",")
      .filter((el) => el.trim() !== "") || [],
};
export { productsPerPage, intitalquery };
