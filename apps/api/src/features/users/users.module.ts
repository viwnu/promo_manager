import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@app/auth';
import { CqrsModule } from '@nestjs/cqrs';
import { User, UserSchema } from './schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [CqrsModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), AuthModule],
  exports: [UsersService],
})
export class UsersModule {}
