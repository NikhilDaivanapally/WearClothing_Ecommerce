import { useEffect } from "react";
import WishlistDisplay from "../components/wishlistview/WishlistDisplay";

const Wishlist = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="">
      <WishlistDisplay />
    </div>
  );
};

export default Wishlist;
