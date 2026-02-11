import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { UserSelfView } from "../../api/source/Api";
import { isUnauthorized } from "../../api/httpError";
import { AuthContext } from "./AuthContext";
import * as authApi from "./api";

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserSelfView | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await authApi.me();
      setUser(data);
    } catch (error) {
      if (isUnauthorized(error)) {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const setUnauthenticated = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      refreshUser,
      logout,
      setUnauthenticated,
    }),
    [user, isLoading, refreshUser, logout, setUnauthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
