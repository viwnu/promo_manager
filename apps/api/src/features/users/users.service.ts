import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

import { User } from './schema';
import { AuthService } from '@app/auth/auth.service';
import { CreateUserDto, UpdateUserDto } from './dto/input';
import { UserViewAllDTO, UserInternalView } from './dto/view';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectConnection() private readonly connection: Connection,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) throw new ForbiddenException('User already exist');
    await this.transaction(async () => {
      const userIdentity = await this.authService.signup(createUserDto);
      await new this.userModel({ ...createUserDto, userIdentity: userIdentity.id }).save();
    });
  }

  async findAll(): Promise<UserViewAllDTO[]> {
    return await this.userModel.find();
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
  }

  async delete(user: UserInternalView): Promise<void> {
    await this.transaction(async () => {
      await this.userModel.deleteOne({ _id: user.id });
      await this.authService.remove({ email: user.userIdentity.email, id: user.userIdentity.id });
    });
  }

  private async transaction(callback: (...args: any[]) => any): Promise<any> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const callbackResult = callback();
      await session.commitTransaction();
      return callbackResult;
    } catch (error) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
}
