import mongoose, { Model } from 'mongoose';
import * as dotenv from 'dotenv';
import { UserIdentity, UserIdentitySchema } from '@app/auth/db';
import { User, UserSchema } from 'src/features/users/schema';
import { Chat, ChatSchema } from 'src/features/chats/schema';
import { Message, MessageSchema } from 'src/features/messages/schema';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const userIdentityModel: Model<UserIdentity> = mongoose.model(UserIdentity.name, UserIdentitySchema);
  const userModel: Model<User> = mongoose.model(User.name, UserSchema);
  const chatModel: Model<Chat> = mongoose.model(Chat.name, ChatSchema);
  const messageModel: Model<Message> = mongoose.model(Message.name, MessageSchema);

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

  const createdUsers = await Promise.all(users.map(async ({ email, name }) => await createUser(name, email)));

  const chats = [
    { name: 'SeedChat#11', ownerId: createdUsers[0].id },
    { name: 'SeedChat#12', ownerId: createdUsers[0].id, membersIds: [createdUsers[1].id] },
    { name: 'SeedChat#13', ownerId: createdUsers[0].id, membersIds: [createdUsers[1].id, createdUsers[2].id] },
    { name: 'SeedChat#21', ownerId: createdUsers[1].id, membersIds: [createdUsers[2].id] },
  ];

  const createdChats = await Promise.all(
    chats.map(
      async ({ name, ownerId, membersIds }) =>
        await new chatModel({ name, owner: ownerId, members: [ownerId, ...(membersIds ? membersIds : [])] }).save(),
    ),
  );

  const messages = [
    { content: 'Message#11', chatId: createdChats[0].id, authorId: createdUsers[0].id },
    { content: 'Message#12', chatId: createdChats[1].id, authorId: createdUsers[0].id },
    { content: 'Message#22', chatId: createdChats[1].id, authorId: createdUsers[1].id },
    { content: 'Message#33', chatId: createdChats[2].id, authorId: createdUsers[2].id },
  ];

  await Promise.all(
    messages.map(
      async ({ content, chatId, authorId }) => await new messageModel({ content, chat: chatId, author: authorId }).save(),
    ),
  );
  await mongoose.disconnect();
  return;
}

seed();
