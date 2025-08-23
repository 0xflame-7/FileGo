import { AuthContext } from "@/context/authContext";
import { useContext } from "react";

export default function useAuth() {
  console.log("useAuth");
  return useContext(AuthContext);
}
