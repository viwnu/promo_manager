import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MongooseSchemaFactory } from '.';
import { ROLE } from '../const';

export type UserIdentityDocument = HydratedDocument<UserIdentity>;

@Schema()
export class UserIdentity {
  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  refreshToken: string;

  @Prop({ default: true, required: true })
  active: boolean;

  @Prop({ type: mongoose.Schema.Types.Array, default: [ROLE.USER], required: true })
  roles: ROLE[];
}

export const UserIdentitySchema = MongooseSchemaFactory(UserIdentity);
