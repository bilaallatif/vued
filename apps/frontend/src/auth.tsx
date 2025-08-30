import React, { createContext, useContext, useState, useEffect } from "react";
import { Default } from "@vued/sdk/api";

interface AuthState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (accessToken) {
      Default.refresh()
        .then((new_access_token) => {
          if (new_access_token && new_access_token.data) {
            setIsAuthenticated(true);
            setAccessToken(new_access_token.data);
            setIsLoading(false);
          }
        })
        .catch(() => {
          console.log("Failed to refresh token");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const login = async (username: string, password: string) => {
    const new_access_token = await Default.login({
      body: { username, password },
    });
    if (new_access_token && new_access_token.data) {
      setIsAuthenticated(true);
      setAccessToken(new_access_token.data);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
