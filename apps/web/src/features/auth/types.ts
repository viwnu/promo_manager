import type { UserSelfView } from "../../api/source/Api";

export type AuthState = {
  user: UserSelfView | null;
  isLoading: boolean;
};

export type AuthActions = {
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  setUnauthenticated: () => void;
};

export type AuthStoreState = AuthState &
  AuthActions & {
    isAuthenticated: boolean;
  };
