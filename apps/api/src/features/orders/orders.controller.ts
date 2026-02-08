import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { ApiDoc } from '@app/api-doc';
import { ApiDocExceptions } from '@app/api-doc/responses';
import { SerializeView } from '@app/serializer';
import { JwtAuthGuard } from '@app/auth/guards';
import { Roles } from '@app/auth/decorators';
import { ROLE } from '@app/auth/const';
import { RolesGuard, UserGuard } from '../users/guards';
import { RequestUser } from '../../decorators';
import { UserSelfView } from '../users/dto/view';
import { ApplyPromoCodeQueryDto, OrderViewDto, PromoCodeUsageViewDto } from './dto';
import { OrderDocument, PromoCodeUsageDocument } from './schema';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiDoc({
    title: { summary: 'Show my orders' },
    responses: [{ status: 200, type: [OrderViewDto], description: 'Orders list' }],
    auth: 'bearer',
  })
  @SerializeView(OrderViewDto)
  @Roles([ROLE.USER])
  @UseGuards(JwtAuthGuard, UserGuard, RolesGuard)
  @Get('my')
  async findMyOrders(@RequestUser() user: UserSelfView): Promise<OrderDocument[]> {
    return this.ordersService.getUserOrders(user.id);
  }

  @ApiDoc({
    title: { summary: 'Apply promo code to order' },
    responses: [
      { status: 200, type: PromoCodeUsageViewDto, description: 'Promo code applied' },
      ApiDocExceptions.notFound,
      ApiDocExceptions.forbidden,
      ApiDocExceptions.badRequest,
    ],
    auth: 'bearer',
  })
  @SerializeView(PromoCodeUsageViewDto)
  @Roles([ROLE.USER])
  @UseGuards(JwtAuthGuard, UserGuard, RolesGuard)
  @Post('apply-promo-code')
  async applyPromoCode(
    @RequestUser() user: UserSelfView,
    @Query() query: ApplyPromoCodeQueryDto,
  ): Promise<PromoCodeUsageDocument> {
    return this.ordersService.applyPromoCode(query.orderId, user.id, query.code);
  }
}
