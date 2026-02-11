import { api } from "../../api/apiClient";
import type { UpdateUserDto, UserViewAllDTO } from "../../api/source/Api";

export async function listUsers(): Promise<UserViewAllDTO[]> {
  const response = await api.api.usersControllerFindAll();
  return (response as { data?: UserViewAllDTO[] }).data ?? (response as unknown as UserViewAllDTO[]);
}

export async function updateUser(dto: UpdateUserDto): Promise<void> {
  await api.api.usersControllerUpdate(dto);
}

export async function banUserByEmail(email: string): Promise<void> {
  await api.api.usersControllerBan({ email });
}
