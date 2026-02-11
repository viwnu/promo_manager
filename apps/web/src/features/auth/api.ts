import { api } from "../../api/apiClient";
import type { CreateUserDto, CreateUserIdentityModel, UserSelfView } from "../../api/source/Api";

export function login(payload: CreateUserIdentityModel) {
  return api.api.authControllerLogin(payload);
}

export function logout() {
  return api.api.authControllerLogout();
}

export function register(payload: CreateUserDto) {
  return api.api.usersControllerSignup(payload);
}

export async function me(): Promise<UserSelfView> {
  const response = await api.api.usersControllerFindOne();
  return (response as { data?: UserSelfView }).data ?? (response as unknown as UserSelfView);
}
