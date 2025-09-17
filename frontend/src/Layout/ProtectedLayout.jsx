import useAuth from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function ProtectedLayout({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // spinner or skeleton
  }

  if (!isAuthenticated) {
    return <Redirect to="/auth" />;
  }

  return <>{children}</>;
}
