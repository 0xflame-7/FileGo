// components/PublicLayout.tsx
import useAuth from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function PublicLayout({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Redirect to="/home" />;
  }

  return <>{children}</>;
}
