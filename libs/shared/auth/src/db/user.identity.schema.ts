import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MongooseSchemaFactory } from '.';

export type UserIdentityDocument = HydratedDocument<UserIdentity>;

@Schema()
export class UserIdentity {
  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  refreshToken: string;
}

export const UserIdentitySchema = MongooseSchemaFactory(UserIdentity);
