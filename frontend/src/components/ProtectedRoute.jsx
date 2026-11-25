
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ allowedRoles, children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const location = useLocation();

  // User login nahi hai
  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // User ka role allowed nahi hai
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // Authorized user
  return children;
}

export default ProtectedRoute;
