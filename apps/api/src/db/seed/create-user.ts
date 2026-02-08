import mongoose, { Model } from 'mongoose';
import { UserIdentityDocument } from '@app/auth/db';
import { UserDocument } from '../../features/users/schema';
import { ROLE } from '@app/auth/const';

export async function createUser(
  userIdentityModel: Model<UserIdentityDocument>,
  userModel: Model<UserDocument>,
  name: string,
  email: string,
  roles: ROLE[] = [ROLE.USER],
) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingUser = await userIdentityModel.findOne({ email }).exec();
    if (existingUser) return await userModel.findOne({ userIdentity: existingUser }).populate('userIdentity').exec();
    const userIdentity = await new userIdentityModel({
      email,
      password: '$2a$05$FBFT.bSXO3.qHtMhfzXN7up0u08NhAl9mzHwB9rLv7w.i950IHII6',
      active: true,
      roles,
    }).save();
    const user = await new userModel({ name, userIdentity }).save();
    await session.commitTransaction();
    return user;
  } catch (error) {
    await session.abortTransaction();
    throw new Error('Session was aborted');
  } finally {
    session.endSession();
  }
}
