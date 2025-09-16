import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "react-hot-toast";

import Router from "@/routes/routes";
import AuthProvider from "./Provider/authProvider";

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Router />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
