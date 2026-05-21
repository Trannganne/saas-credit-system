import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function PrivateRoute({ children }) {
    const { token } = useAuth();

    // CHưa đăng nhập về login
    if (!token) return <Navigate to="/login" />
    return children;
}