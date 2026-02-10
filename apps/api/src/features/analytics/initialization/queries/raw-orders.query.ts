import { AnalyticsColumn, ClickHouseInitQuery } from './types';
import { Order } from '../../../orders/schema';
import { USER_IDENTITY_FIELD_MAP, USER_FIELD_MAP } from './raw-users.query';

const ORDER_FIELD_MAP = {
  id: { key: 'order_id', type: 'String' },
  userId: { key: 'user_id', type: 'String' },
  amount: { key: 'amount', type: 'Decimal(18, 2)' },
  promoCode: { key: 'promo_code', type: 'String' },
  createdAt: { key: 'created_at', type: 'DateTime' },
} satisfies Record<keyof Pick<Order, 'id' | 'userId' | 'amount' | 'promoCode' | 'createdAt'>, AnalyticsColumn>;

export const RAW_ORDERS_TABLE_NAME = 'raw_orders';

export const RAW_ORDERS_TABLE: ClickHouseInitQuery = {
  name: RAW_ORDERS_TABLE_NAME,
  sql: `
DROP TABLE IF EXISTS ${RAW_ORDERS_TABLE_NAME};
CREATE TABLE IF NOT EXISTS ${RAW_ORDERS_TABLE_NAME} (
  ${ORDER_FIELD_MAP.id.key} ${ORDER_FIELD_MAP.id.type},
  ${ORDER_FIELD_MAP.userId.key} ${ORDER_FIELD_MAP.userId.type},
  ${USER_IDENTITY_FIELD_MAP.email.key} ${USER_IDENTITY_FIELD_MAP.email.type},
  ${USER_FIELD_MAP.name.key} ${USER_FIELD_MAP.name.type},
  ${USER_FIELD_MAP.phone.key} ${USER_FIELD_MAP.phone.type},
  ${ORDER_FIELD_MAP.amount.key} ${ORDER_FIELD_MAP.amount.type},
  ${ORDER_FIELD_MAP.promoCode.key} ${ORDER_FIELD_MAP.promoCode.type},
  ${ORDER_FIELD_MAP.createdAt.key} ${ORDER_FIELD_MAP.createdAt.type}
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(${ORDER_FIELD_MAP.createdAt.key})
ORDER BY (${ORDER_FIELD_MAP.createdAt.key}, ${ORDER_FIELD_MAP.userId.key}, ${ORDER_FIELD_MAP.id.key})
SETTINGS index_granularity = 8192
`,
};

export const RAW_ORDERS_FIELD_MAP = ORDER_FIELD_MAP;
