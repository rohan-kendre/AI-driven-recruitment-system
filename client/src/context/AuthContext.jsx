import { useState, useEffect, useCallback, createContext } from "react";
import { authApi, setAccessToken } from "../services/api.js";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

function computeInitials(name = "") {
  if (!name) return "NH";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    initials: user.initials || computeInitials(user.name),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const data = await authApi.refresh();
      if (data?.accessToken && data?.user) {
        setAccessToken(data.accessToken);
        setUser(normalizeUser(data.user));
        return data.user;
      }
      setAccessToken(null);
      setUser(null);
      return null;
    } catch {
      setAccessToken(null);
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    authApi
      .refresh()
      .then((data) => {
        if (!isMounted) return;
        if (data?.accessToken && data?.user) {
          setAccessToken(data.accessToken);
          setUser(normalizeUser(data.user));
        } else {
          setAccessToken(null);
          setUser(null);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setAccessToken(null);
        setUser(null);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password });
    if (data?.accessToken && data?.user) {
      setAccessToken(data.accessToken);
      const safeUser = normalizeUser(data.user);
      setUser(safeUser);
      return safeUser;
    }
    throw new Error(data?.message || "Login failed");
  }, []);

  const register = useCallback(async (userData) => {
    return authApi.register(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn("Logout API warning:", error?.message);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
