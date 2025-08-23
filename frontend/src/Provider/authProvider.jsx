import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { AuthContext } from "@/context/authContext";



export default function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  console.log("AuthProvider");

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: () => apiRequest("GET", "/api/auth/user"),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const login = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/auth/login", data),
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/user"], data.user);
      toast.success("Welcome back!", { description: "Signed in successfully." });
      setLocation("/");
    },
    onError: (err) => {
      toast.error("Login failed", {
        description: err.message || "Something went wrong",
      });
    },
  });

  const register = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/auth/register", data),
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/user"], data.user);
      toast.success("Welcome!", { description: "Account created successfully." });
      setLocation("/");
    },
    onError: (err) => {
      toast.error("Registration failed", {
        description: err.message || "Something went wrong",
      });
    },
  });

  const logout = useMutation({
    mutationFn: () => apiRequest("GET", "/api/auth/logout"),
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
      queryClient.clear();
      toast.success("Signed out", { description: "You have been signed out." });
      setLocation("/");
    },
    onError: (err) => {
      toast.error("Sign out failed", {
        description: err.message || "Something went wrong",
      });
    },
  });

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

