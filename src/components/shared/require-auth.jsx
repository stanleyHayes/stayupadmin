import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectAuth } from "../../redux/features/authentication/authentication-slice";

const RequireAuth = ({ children }) => {
    const { isAuthenticated } = useSelector(selectAuth);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return children;
};

export default RequireAuth;
