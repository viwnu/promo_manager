import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { EventBus } from '@nestjs/cqrs';

import { User } from './schema';
import { AuthService } from '@app/auth/auth.service';
import { CreateUserDto, UpdateUserDto } from './dto/input';
import { UserViewAllDTO, UserInternalView } from './dto/view';
import { plainToInstance } from 'class-transformer';
import { UserCreatedEvent, UserUpdatedEvent } from '../../events';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectConnection() private readonly connection: Connection,
    private readonly authService: AuthService,
    private readonly eventBus: EventBus,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) throw new ForbiddenException('User already exist');
    let createdUserId: string | undefined;
    await this.transaction(async () => {
      const userIdentity = await this.authService.signup(createUserDto);
      const created = await new this.userModel({ ...createUserDto, userIdentity: userIdentity.id }).save();
      createdUserId = created.id;
    });

    if (!createdUserId) return;
    const createdUser = await this.userModel.findById(createdUserId).populate('userIdentity').lean();
    if (!createdUser) return;

    this.eventBus.publish(
      new UserCreatedEvent({
        id: createdUser.id ?? createdUser._id?.toString?.(),
        name: createdUser.name,
        phone: createdUser.phone,
        email: (createdUser as any).userIdentity?.email ?? createUserDto.email,
        createdAt: (createdUser as any).createdAt,
        active: (createdUser as any).userIdentity?.active,
      }),
    );
  }

  async findAll(): Promise<UserViewAllDTO[]> {
    const users = await this.userModel.find().populate('userIdentity').lean();
    return plainToInstance(UserViewAllDTO, users, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  async findOneByEmail(email: string): Promise<UserInternalView> {
    const userIdentity = await this.authService.findByEmail(email);
    if (!userIdentity) return null;
    const user = await this.userModel.findOne({ userIdentity }).populate('userIdentity');
    return plainToInstance(UserInternalView, user.toObject(), {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  async update(user: UserInternalView, updateUserDto: UpdateUserDto): Promise<void> {
    await this.userModel.updateOne({ _id: user.id }, updateUserDto);
    const updatedUser = await this.userModel.findById(user.id).populate('userIdentity').lean();
    if (!updatedUser) return;
    this.eventBus.publish(
      new UserUpdatedEvent({
        id: updatedUser.id ?? updatedUser._id?.toString?.(),
        name: updatedUser.name,
        phone: updatedUser.phone,
        email: (updatedUser as any).userIdentity?.email,
        createdAt: (updatedUser as any).createdAt,
        active: (updatedUser as any).userIdentity?.active,
      }),
    );
  }

  async delete(user: UserInternalView): Promise<void> {
    await this.transaction(async () => {
      await this.userModel.deleteOne({ _id: user.id });
      await this.authService.remove(user.userIdentity);
    });
  }

  private async transaction(callback: (...args: any[]) => any): Promise<any> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const callbackResult = await callback();
      await session.commitTransaction();
      return callbackResult;
    } catch (error) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
}
