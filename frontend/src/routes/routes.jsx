// Router.tsx
import { Switch, Route } from "wouter";

import ProtectedLayout from "@/Layout/ProtectedLayout";
import PublicLayout from "@/Layout/PublicLayout";

import Home from "@/pages/home";
import Landing from "@/pages/landing";
import Auth from "@/pages/auth";
import Download from "@/pages/download";
import NotFound from "@/pages/not-found";
import useAuth from "@/hooks/use-auth";

function Router() {
  const { isLoading, isAuthenticated } = useAuth();

  console.log("Router");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Switch>
      {/* Root → Landing if not logged in, Home if logged in */}
      <Route path="/">
        {isAuthenticated ? (
          <ProtectedLayout>
            <Home />
          </ProtectedLayout>
        ) : (
          <Landing />
        )}
      </Route>

      {/* Auth page (blocked if logged in) */}
      <Route path="/auth">
        <PublicLayout>
          <Auth />
        </PublicLayout>
      </Route>

      {/* Protected downloads */}
      <Route path="/download/:id">
        <ProtectedLayout>
          <Download />
        </ProtectedLayout>
      </Route>

      {/* Catch-all */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default Router;
