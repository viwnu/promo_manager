import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

import { AnalyticsUsersDatePreset } from '../types/analytics-users.types';

export class AnalyticsUsersQueryDto {
  @ApiPropertyOptional({
    enum: ['today', 'last7Days', 'last30Days', 'custom'],
    description: 'Date preset for stats range',
  })
  @IsOptional()
  @IsEnum(['today', 'last7Days', 'last30Days', 'custom'])
  datePreset?: AnalyticsUsersDatePreset;

  @ApiPropertyOptional({ type: 'string', format: 'date', example: '2026-02-10', description: 'Start date' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ type: 'string', format: 'date', example: '2026-02-10', description: 'End date' })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({ type: 'number', example: 50, description: 'Limit' })
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsInt()
  @Min(0)
  limit?: number;

  @ApiPropertyOptional({ type: 'number', example: 0, description: 'Offset' })
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsInt()
  @Min(0)
  offset?: number;

  @ApiPropertyOptional({ type: 'string', example: 'orders_count', description: 'Sort field' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], description: 'Sort direction' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortDir?: 'asc' | 'desc';

  @ApiPropertyOptional({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'User id' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ type: 'string', example: 'user@email.com', description: 'Email' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ type: 'string', example: 'John', description: 'Name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: 'string', example: '+12025550123', description: 'Phone' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ type: 'string', example: 'john', description: 'Search in email/name/phone' })
  @IsOptional()
  @IsString()
  search?: string;
}
