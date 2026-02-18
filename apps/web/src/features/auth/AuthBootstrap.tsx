import { useEffect } from "react";
import { useAuthStore } from "./store";

export function AuthBootstrap() {
  const refreshUser = useAuthStore((state) => state.refreshUser);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  return null;
}
