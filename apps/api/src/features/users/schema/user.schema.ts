import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserIdentity } from '@app/auth/db';
import { MongooseSchemaFactory } from 'apps/api/src/db/schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: UserIdentity.name })
  userIdentity: UserIdentity;

  @Prop()
  phone: string;
}

export const UserSchema = MongooseSchemaFactory(User);
