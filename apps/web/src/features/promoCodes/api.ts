import { api } from "../../api/apiClient";
import type { CreatePromoCodeDto, PromoCodeViewDto, UpdatePromoCodeDto } from "../../api/source/Api";

export async function listPromoCodes(): Promise<PromoCodeViewDto[]> {
  const response = await api.api.promoCodesControllerFindAll();
  return (response as { data?: PromoCodeViewDto[] }).data ?? (response as unknown as PromoCodeViewDto[]);
}

export async function createPromoCode(payload: CreatePromoCodeDto): Promise<PromoCodeViewDto> {
  const response = await api.api.promoCodesControllerCreate(payload);
  return (response as { data?: PromoCodeViewDto }).data ?? (response as unknown as PromoCodeViewDto);
}

export async function updatePromoCode(id: string, payload: UpdatePromoCodeDto): Promise<PromoCodeViewDto> {
  const response = await api.api.promoCodesControllerUpdate(id, payload);
  return (response as { data?: PromoCodeViewDto }).data ?? (response as unknown as PromoCodeViewDto);
}

export async function disablePromoCode(id: string): Promise<PromoCodeViewDto> {
  const response = await api.api.promoCodesControllerDisable(id);
  return (response as { data?: PromoCodeViewDto }).data ?? (response as unknown as PromoCodeViewDto);
}
