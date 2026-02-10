import { AnalyticsColumn, ClickHouseInitQuery } from './types';
import { User } from '../../../users/schema';
import { UserIdentity } from '@app/auth/db';

export const USER_FIELD_MAP = {
  id: { key: 'user_id', type: 'String' },
  name: { key: 'name', type: 'String' },
  phone: { key: 'phone', type: 'String' },
} satisfies Record<keyof Pick<User, 'id' | 'name' | 'phone'>, AnalyticsColumn>;

export const USER_IDENTITY_FIELD_MAP = {
  email: { key: 'email', type: 'String' },
} satisfies Record<keyof Pick<UserIdentity, 'email'>, AnalyticsColumn>;

const RAW_USERS_FIELDS = {
  createdAt: { key: 'created_at', type: 'DateTime' },
} as const satisfies Record<string, AnalyticsColumn>;

export const RAW_USERS_TABLE_NAME = 'raw_users';

export const RAW_USERS_TABLE: ClickHouseInitQuery = {
  name: RAW_USERS_TABLE_NAME,
  sql: `
DROP TABLE IF EXISTS ${RAW_USERS_TABLE_NAME};
CREATE TABLE IF NOT EXISTS ${RAW_USERS_TABLE_NAME} (
  ${USER_FIELD_MAP.id.key} ${USER_FIELD_MAP.id.type},
  ${USER_IDENTITY_FIELD_MAP.email.key} ${USER_IDENTITY_FIELD_MAP.email.type},
  ${USER_FIELD_MAP.name.key} ${USER_FIELD_MAP.name.type},
  ${USER_FIELD_MAP.phone.key} ${USER_FIELD_MAP.phone.type},
  ${RAW_USERS_FIELDS.createdAt.key} ${RAW_USERS_FIELDS.createdAt.type}
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(${RAW_USERS_FIELDS.createdAt.key})
ORDER BY (${RAW_USERS_FIELDS.createdAt.key}, ${USER_FIELD_MAP.id.key})
SETTINGS index_granularity = 8192
`,
};

export const RAW_USERS_FIELDS_MAP = RAW_USERS_FIELDS;
