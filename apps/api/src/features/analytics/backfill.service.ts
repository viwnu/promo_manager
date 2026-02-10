import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CLICKHOUSE_ASYNC_INSTANCE_TOKEN, ClickHouseClient } from '@depyronick/nestjs-clickhouse';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PromoCode } from '../promo-codes/schema';
import { Order, OrderDocument, PromoCodeUsage, PromoCodeUsageDocument } from '../orders/schema';
import { User, UserDocument } from '../users/schema';
import { USER_FIELD_MAP, USER_IDENTITY_FIELD_MAP } from './initialization/queries/analytics-users.query';
import { RAW_ORDERS_FIELD_MAP } from './initialization/queries/raw-orders.query';
import { RAW_USERS_FIELDS_MAP } from './initialization/queries/raw-users.query';
import {
  PROMO_CODE_CODE_FIELD,
  PROMO_CODE_USAGE_FIELD_MAP,
  PROMO_CODE_USAGE_USER_FIELDS,
} from './initialization/queries/raw-promo-code-usage.query';

@Injectable()
export class BackfillService implements OnModuleInit {
  private readonly logger = new Logger(BackfillService.name);

  constructor(
    @Inject(CLICKHOUSE_ASYNC_INSTANCE_TOKEN) private readonly clickhouse: ClickHouseClient,
    @InjectModel(PromoCodeUsage.name) private readonly promoCodeUsageModel: Model<PromoCodeUsageDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.seedAnalyticsFromMongo();
    } catch (error) {
      this.logger.error('ClickHouse init failed', error as Error);
    }
  }

  private async seedAnalyticsFromMongo(): Promise<void> {
    await this.truncateRawTables();

    const readBatchSize = 1000;

    let rawUsersCount = 0;
    const usersCursor = this.userModel.find().populate('userIdentity').lean().cursor();
    for await (const rawUsers of this.batchCursor(usersCursor, readBatchSize)) {
      const rows = this.mapRawUsers(rawUsers);
      if (rows.length === 0) continue;
      await this.insertBatched('raw_users', rows);
      rawUsersCount += rows.length;
    }
    if (rawUsersCount > 0) {
      this.logger.log(`Inserted ${rawUsersCount} rows into raw_users`);
    }

    let rawOrdersCount = 0;
    const ordersCursor = this.orderModel
      .find()
      .populate({ path: 'userId', populate: { path: 'userIdentity', select: 'email active roles' } })
      .lean()
      .cursor();
    for await (const rawOrders of this.batchCursor(ordersCursor, readBatchSize)) {
      const rows = this.mapRawOrders(rawOrders);
      if (rows.length === 0) continue;
      await this.insertBatched('raw_orders', rows);
      rawOrdersCount += rows.length;
    }
    if (rawOrdersCount > 0) {
      this.logger.log(`Inserted ${rawOrdersCount} rows into raw_orders`);
    }

    let rawUsagesCount = 0;
    const usagesCursor = this.promoCodeUsageModel
      .find()
      .populate([
        { path: 'userId', populate: { path: 'userIdentity', select: 'email active roles' } },
        { path: 'orderId' },
        { path: 'promoCodeId' },
      ])
      .lean()
      .cursor();
    for await (const rawUsages of this.batchCursor(usagesCursor, readBatchSize)) {
      const rows = this.mapRawPromoCodeUsage(rawUsages);
      if (rows.length === 0) continue;
      await this.insertBatched('raw_promo_code_usage', rows);
      rawUsagesCount += rows.length;
    }
    if (rawUsagesCount === 0) {
      this.logger.log('No promo code usages found. Analytics promo usage table left empty.');
      return;
    }
    this.logger.log(`Inserted ${rawUsagesCount} rows into raw_promo_code_usage`);
  }

  private async truncateRawTables(): Promise<void> {
    await this.clickhouse.queryPromise('TRUNCATE TABLE IF EXISTS raw_users');
    await this.clickhouse.queryPromise('TRUNCATE TABLE IF EXISTS raw_orders');
    await this.clickhouse.queryPromise('TRUNCATE TABLE IF EXISTS raw_promo_code_usage');
  }

  public mapRawUsersRows(users: any[]): Record<string, any>[] {
    return this.mapRawUsers(users);
  }

  private mapRawUsers(users: any[]): Record<string, any>[] {
    return users.map((user) => ({
      [USER_FIELD_MAP.id.key]: this.toId(user),
      [USER_IDENTITY_FIELD_MAP.email.key]: (user as any).userIdentity?.email ?? '',
      [USER_FIELD_MAP.name.key]: user.name ?? '',
      [USER_FIELD_MAP.phone.key]: user.phone ?? '',
      [RAW_USERS_FIELDS_MAP.createdAt.key]: this.formatDateTime((user as any).createdAt ?? new Date()),
    }));
  }

  public mapRawOrdersRows(orders: any[]): Record<string, any>[] {
    return this.mapRawOrders(orders);
  }

  private mapRawOrders(orders: any[]): Record<string, any>[] {
    return orders.map((order) => {
      const user = order.userId as User | undefined;
      const userId = this.toId(user ?? {});
      return {
        [RAW_ORDERS_FIELD_MAP.id.key]: this.toId(order),
        [RAW_ORDERS_FIELD_MAP.userId.key]: userId,
        [USER_IDENTITY_FIELD_MAP.email.key]: (user as any)?.userIdentity?.email ?? '',
        [USER_FIELD_MAP.name.key]: user?.name ?? '',
        [USER_FIELD_MAP.phone.key]: user?.phone ?? '',
        [RAW_ORDERS_FIELD_MAP.amount.key]: order.amount,
        [RAW_ORDERS_FIELD_MAP.promoCode.key]: order.promoCode ?? '',
        [RAW_ORDERS_FIELD_MAP.createdAt.key]: this.formatDateTime(order.createdAt ?? new Date()),
      };
    });
  }

  public mapRawPromoCodeUsageRows(usages: any[]): Record<string, any>[] {
    return this.mapRawPromoCodeUsage(usages);
  }

  private mapRawPromoCodeUsage(usages: any[]): Record<string, any>[] {
    return usages.map((usage) => {
      const promoCode = usage.promoCodeId as PromoCode | undefined;
      const user = usage.userId as User | undefined;
      const order = usage.orderId as Order | undefined;
      const promoCodeId = this.toId(promoCode ?? {});
      const userId = this.toId(user ?? {});
      const orderId = this.toId(order ?? {});
      return {
        [PROMO_CODE_USAGE_FIELD_MAP.createdAt.key]: this.formatDateTime(usage.createdAt ?? new Date()),
        [PROMO_CODE_USAGE_FIELD_MAP.promoCodeId.key]: promoCodeId,
        [PROMO_CODE_CODE_FIELD.key]: promoCode?.code ?? '',
        [PROMO_CODE_USAGE_FIELD_MAP.userId.key]: userId,
        [PROMO_CODE_USAGE_FIELD_MAP.orderId.key]: orderId,
        [PROMO_CODE_USAGE_USER_FIELDS.email.key]: (user as any)?.userIdentity?.email ?? '',
        [PROMO_CODE_USAGE_USER_FIELDS.name.key]: user?.name ?? '',
        [PROMO_CODE_USAGE_USER_FIELDS.phone.key]: user?.phone ?? '',
        [PROMO_CODE_USAGE_FIELD_MAP.orderAmount.key]: order?.amount ?? 0,
        [PROMO_CODE_USAGE_FIELD_MAP.discountAmount.key]: usage.discountAmount,
      };
    });
  }

  public async insertRows(table: string, rows: Record<string, any>[], batchSize = 1000): Promise<void> {
    return this.insertBatched(table, rows, batchSize);
  }

  private async insertBatched(table: string, rows: Record<string, any>[], batchSize = 1000): Promise<void> {
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      await this.clickhouse.insertPromise(table, batch);
    }
  }

  private async *batchCursor<T>(cursor: AsyncIterable<T>, batchSize: number): AsyncGenerator<T[]> {
    let batch: T[] = [];
    for await (const item of cursor) {
      batch.push(item);
      if (batch.length >= batchSize) {
        yield batch;
        batch = [];
      }
    }
    if (batch.length > 0) {
      yield batch;
    }
  }

  private toId(doc: { _id?: any; id?: string }): string {
    return doc.id ?? doc._id?.toString?.() ?? '';
  }

  private formatDateTime(value: Date | string): string {
    const date = value instanceof Date ? value : new Date(value);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
      date.getMinutes(),
    )}:${pad(date.getSeconds())}`;
  }

  public formatDateTimeValue(value: Date | string): string {
    return this.formatDateTime(value);
  }
}
