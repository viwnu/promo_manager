import mongoose, { Model } from 'mongoose';
import * as dotenv from 'dotenv';
import { UserIdentity, UserIdentitySchema } from '@app/auth/db';
import { User, UserSchema } from '../../features/users/schema';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const userIdentityModel: Model<UserIdentity> = mongoose.model(UserIdentity.name, UserIdentitySchema) as Model<UserIdentity>;
  const userModel: Model<User> = mongoose.model(User.name, UserSchema) as Model<User>;

  const createUser = async (name: string, email: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const existingUser = await userIdentityModel.findOne({ email }).exec();
      if (existingUser) return await userModel.findOne({ userIdentity: existingUser }).populate('userIdentity').exec();
      const userIdentity = await new userIdentityModel({
        email,
        password: '$2a$05$FBFT.bSXO3.qHtMhfzXN7up0u08NhAl9mzHwB9rLv7w.i950IHII6',
      }).save();
      const user = await new userModel({ nickname: name, userIdentity }).save();
      await session.commitTransaction();
      return user;
    } catch (error) {
      await session.abortTransaction();
      throw new Error('Session was aborted');
    } finally {
      session.endSession();
    }
  };

  const users = [
    { name: 'SeedUser#1', email: 'seed_1@email.com', password: 'my-strong-password' },
    { name: 'SeedUser#2', email: 'seed_2@email.com', password: 'my-strong-password' },
    { name: 'SeedUser#3', email: 'seed_3@email.com', password: 'my-strong-password' },
  ];

  await Promise.all(users.map(async ({ email, name }) => await createUser(name, email)));

  await mongoose.disconnect();
  return;
}

seed();
