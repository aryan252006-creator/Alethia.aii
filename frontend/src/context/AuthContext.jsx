import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        // Mock login logic
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        if (userData.role === "Startup") {
            navigate("/dashboard/startup");
        } else {
            navigate("/dashboard/investor");
        }
    };

    const signup = (userData) => {
        // Mock signup logic (same as login/store)
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        if (userData.role === "Startup") {
            navigate("/dashboard/startup");
        } else {
            navigate("/dashboard/investor");
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
