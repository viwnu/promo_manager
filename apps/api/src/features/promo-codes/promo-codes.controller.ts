import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PromoCodesService } from './promo-codes.service';
import { CreatePromoCodeDto, PromoCodeViewDto, UpdatePromoCodeDto } from './dto';
import { ApiDoc } from '@app/api-doc';
import { ApiDocExceptions } from '@app/api-doc/responses';
import { SerializeView } from '@app/serializer';
import { JwtAuthGuard } from '@app/auth/guards';
import { Roles } from '@app/auth/decorators';
import { ROLE } from '@app/auth/const';
import { RolesGuard, UserGuard } from '../users/guards';

@ApiTags('Promo codes')
@Controller('promo-codes')
export class PromoCodesController {
  constructor(private readonly promoCodesService: PromoCodesService) {}

  @ApiDoc({
    title: { summary: 'Create promo code' },
    responses: [
      { status: 201, type: PromoCodeViewDto, description: 'Promo code created' },
      ApiDocExceptions.forbidden,
      ApiDocExceptions.badRequest,
    ],
    auth: 'bearer',
  })
  @SerializeView(PromoCodeViewDto)
  @Roles([ROLE.ADMIN])
  @UseGuards(JwtAuthGuard, UserGuard, RolesGuard)
  @Post()
  create(@Body() dto: CreatePromoCodeDto): Promise<PromoCodeViewDto> {
    return this.promoCodesService.create(dto);
  }

  @ApiDoc({
    title: { summary: 'Show all promo codes' },
    responses: [{ status: 200, type: [PromoCodeViewDto], description: 'All promo codes' }],
    auth: 'bearer',
  })
  @SerializeView(PromoCodeViewDto)
  @Roles([ROLE.USER])
  @UseGuards(JwtAuthGuard, UserGuard, RolesGuard)
  @Get()
  findAll(): Promise<PromoCodeViewDto[]> {
    return this.promoCodesService.findAll();
  }

  @ApiDoc({
    title: { summary: 'Show promo code by id' },
    responses: [{ status: 200, type: PromoCodeViewDto, description: 'Promo code' }, ApiDocExceptions.notFound],
    auth: 'bearer',
  })
  @SerializeView(PromoCodeViewDto)
  @Roles([ROLE.USER])
  @UseGuards(JwtAuthGuard, UserGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<PromoCodeViewDto> {
    return this.promoCodesService.findOne(id);
  }

  @ApiDoc({
    title: { summary: 'Update promo code' },
    responses: [
      { status: 200, type: PromoCodeViewDto, description: 'Promo code updated' },
      ApiDocExceptions.notFound,
      ApiDocExceptions.forbidden,
      ApiDocExceptions.badRequest,
    ],
    auth: 'bearer',
  })
  @SerializeView(PromoCodeViewDto)
  @Roles([ROLE.ADMIN])
  @UseGuards(JwtAuthGuard, UserGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePromoCodeDto: UpdatePromoCodeDto): Promise<PromoCodeViewDto> {
    return this.promoCodesService.update(id, updatePromoCodeDto);
  }

  @ApiDoc({
    title: { summary: 'Deactivate promo code' },
    responses: [{ status: 200, type: PromoCodeViewDto, description: 'Promo code deactivated' }, ApiDocExceptions.notFound],
    auth: 'bearer',
  })
  @SerializeView(PromoCodeViewDto)
  @Roles([ROLE.ADMIN])
  @UseGuards(JwtAuthGuard, UserGuard, RolesGuard)
  @Patch('disable/:id')
  remove(@Param('id') id: string): Promise<PromoCodeViewDto> {
    return this.promoCodesService.disable(id);
  }
}
