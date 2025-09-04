import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
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

  const access_token_ref = useRef<string | null>(null);
  const setup_interceptors_ref = useRef(false);

  const apiUrl: string = import.meta.env.VITE_API_URL;

  let authInstanceId = 0;

  // Update the mutable instance of access_token when accessToken changes
  useEffect(() => {
    access_token_ref.current = accessToken;
  }, [accessToken]);

  // Attempt to refresh access_token on mount
  useEffect(() => {
    const id = ++authInstanceId;
    console.log("Mounting with id:", id);

    client.setConfig({
      // Set base URL
      baseUrl: apiUrl,
      // Send/Receive cookies
      credentials: "include",
    });

    // Only setup interceptors once
    if (!setup_interceptors_ref.current) {
      // Attach access_token to all requests
      client.interceptors.request.use((request) => {
        request.headers.set(
          "Authorization",
          `Bearer ${access_token_ref.current}`,
        );
        return request;
      });

      client.interceptors.response.use((res, req, _opts): Response => {
        // If response is 401 and is not a retry request
        if (
          !req.url.endsWith("/refresh") &&
          res.status == 401 &&
          req.headers.get("Retry") != "true"
        ) {
          // Attempt to refresh access_token
          Default.refresh()
            .then((new_access_token) => {
              if (new_access_token && new_access_token.data) {
                console.log("Refreshing token!");
                setAccessToken(new_access_token.data);
                const retryReq = new Request(req);
                retryReq.headers.set(
                  "Authorization",
                  `Bearer ${new_access_token.data}`,
                );
                retryReq.headers.set("Retry", "true");
                return fetch(retryReq);
              }
            })
            .catch(() => {
              console.log("Failed refresh!");
            });
        }
        return res;
      });
      setup_interceptors_ref.current = true;
    }

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
    return () => {
      console.log("Cleaning up for id:", id);
    };
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
