import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Assuming you use Redux for authentication
import { ReactNode } from "react";
import { RootState } from "./store/Store";
interface AuthGuardprop {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardprop> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.user); // Replace with your actual auth logic
  return isAuthenticated?.user.role === "Admin" ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

export default AuthGuard;
