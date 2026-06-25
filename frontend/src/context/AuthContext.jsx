import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Decodes a JWT token payload locally to extract basic info in fallback cases
  const decodeToken = (jwtToken) => {
    try {
      const base64Url = jwtToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  const fetchProfile = async (currentToken) => {
    try {
      const response = await API.get("/auth/me");
      if (response.data && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error("Failed to fetch user profile, clearing session:", error);
      // If we failed to get profile (e.g. invalid token, backend down/refused), clear auth
      handleLogoutLocal();
    }
  };

  const handleLogoutLocal = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
            // Quietly refresh profile in background to keep data in sync
            fetchProfile(storedToken);
          } catch (e) {
            await fetchProfile(storedToken);
          }
        } else {
          await fetchProfile(storedToken);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (newToken, userObject = null) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setLoading(true);

    if (userObject) {
      setUser(userObject);
      localStorage.setItem("user", JSON.stringify(userObject));
      setLoading(false);
    } else {
      // If no user object was provided (e.g., from OAuth success callback), fetch it from backend
      try {
        const response = await API.get("/auth/me");
        if (response.data && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
      } catch (err) {
        console.error("Failed to load user profile after token login:", err);
        // Fallback: parse payload from JWT directly if API is unavailable
        const decoded = decodeToken(newToken);
        if (decoded) {
          const fallbackUser = {
            _id: decoded.userId,
            email: decoded.email,
            roleId: { name: decoded.roleName },
            firstName: decoded.firstName || "User",
            lastName: decoded.lastName || ""
          };
          setUser(fallbackUser);
          localStorage.setItem("user", JSON.stringify(fallbackUser));
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await API.post("/auth/logout", { refreshToken: localStorage.getItem("token") });
    } catch (err) {
      console.warn("Logout request failed on server:", err);
    } finally {
      handleLogoutLocal();
      setLoading(false);
    }
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated,
        role: user?.roleId?.name || null
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
