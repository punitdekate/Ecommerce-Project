import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.userLoginReducer);

  // If the user is not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to='/' replace />;
  }

  // If the user is logged in, render the protected component (children)
  return children;
};

export default ProtectedRoute;
