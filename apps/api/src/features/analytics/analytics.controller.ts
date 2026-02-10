import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiDoc } from '@app/api-doc';
import { SerializeView } from '@app/serializer';
import { JwtAuthGuard } from '@app/auth/guards';
import { Roles } from '@app/auth/decorators';
import { ROLE } from '@app/auth/const';
import { RolesGuard, UserGuard } from '../users/guards';
import { AnalyticService } from './analytic.service';
import {
  AnalyticsUsersQueryDto,
  AnalyticsUsersAggregatedStatsViewDto,
  AnalyticsPromoCodesQueryDto,
  AnalyticsPromoCodesAggregatedStatsViewDto,
} from './dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticService: AnalyticService) {}

  @ApiDoc({
    title: { summary: 'Get users aggregated statistics' },
    responses: [{ status: 200, type: AnalyticsUsersAggregatedStatsViewDto, description: 'Aggregated stats' }],
    auth: 'bearer',
  })
  @SerializeView(AnalyticsUsersAggregatedStatsViewDto)
  @Roles([ROLE.ADMIN])
  @UseGuards(JwtAuthGuard, UserGuard, RolesGuard)
  @Get('users')
  getUsersAggregatedStats(@Query() query: AnalyticsUsersQueryDto): Promise<AnalyticsUsersAggregatedStatsViewDto> {
    return this.analyticService.getUsersAggregatedStatsFromQuery(query);
  }

  @ApiDoc({
    title: { summary: 'Get promo codes aggregated statistics' },
    responses: [{ status: 200, type: AnalyticsPromoCodesAggregatedStatsViewDto, description: 'Aggregated stats' }],
    auth: 'bearer',
  })
  @SerializeView(AnalyticsPromoCodesAggregatedStatsViewDto)
  @Roles([ROLE.ADMIN])
  @UseGuards(JwtAuthGuard, UserGuard, RolesGuard)
  @Get('promo-codes')
  getPromoCodesAggregatedStats(
    @Query() query: AnalyticsPromoCodesQueryDto,
  ): Promise<AnalyticsPromoCodesAggregatedStatsViewDto> {
    return this.analyticService.getPromoCodesAggregatedStatsFromQuery(query);
  }
}
