import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import ToastConfig from "../../toastConfig/ToastConfig";

const RootLayout: React.FC = () => {
  return (
    <div className="">
      <ToastConfig />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default RootLayout;
