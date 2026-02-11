import { createContext } from "react";
import type { UserSelfView } from "../../api/source/Api";

export type AuthContextValue = {
  user: UserSelfView | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  setUnauthenticated: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
