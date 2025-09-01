import React, { createContext, useContext, useState, useEffect } from "react";
import { client } from "@vued/sdk/api/client.gen";
import { Default } from "@vued/sdk/api";

export interface AuthState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl: string = import.meta.env.VITE_API_URL;

  client.setConfig({
    baseUrl: apiUrl,
    credentials: "include",
  });

  client.interceptors.request.use((request) => {
    request.headers.set("Authorization", `Bearer ${accessToken}`);
    return request;
  });

  client.interceptors.response.use((res, req, _opts): Response => {
    if (res.status == 401) {
      Default.refresh().then((new_access_token) => {
        if (new_access_token && new_access_token.data) {
          console.log("Refreshing token!");
          setAccessToken(new_access_token.data);
          const retryReq = new Request(req);
          retryReq.headers.set(
            "Authorization",
            `Bearer ${new_access_token.data}`,
          );
          return fetch(retryReq);
        }
      });
    }
    return res;
  });

  // Attempt to refresh access_token on mount
  useEffect(() => {
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
  }, []);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // Request new refresh_token(Http-Cookie) and access_token on login
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
