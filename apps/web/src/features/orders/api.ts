import { api } from "../../api/apiClient";
import type { OrderViewDto, PromoCodeUsageViewDto } from "../../api/source/Api";

export async function listMyOrders(): Promise<OrderViewDto[]> {
  const response = await api.api.ordersControllerFindMyOrders();
  return (response as { data?: OrderViewDto[] }).data ?? (response as unknown as OrderViewDto[]);
}

export async function applyPromoCode(orderId: string, code: string): Promise<PromoCodeUsageViewDto> {
  const response = await api.api.ordersControllerApplyPromoCode({ orderId, code });
  return (response as { data?: PromoCodeUsageViewDto }).data ?? (response as unknown as PromoCodeUsageViewDto);
}
