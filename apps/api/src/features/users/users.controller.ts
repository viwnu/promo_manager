import { Controller, Get, Body, Patch, UseGuards, Post, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UpdateUserDto, CreateUserDto } from './dto/input';
import { UserViewAllDTO, UserSelfView, UserInternalView } from './dto/view';
import { UserGuard } from './guards';
import { ApiDoc } from '@app/api-doc';
import { ApiDocExceptions } from '@app/api-doc/responses';
import { SerializeView } from '@app/serializer';
import { JwtAuthGuard } from '@app/auth/guards';
import { RequestUser } from '../../decorators';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiDoc({
    title: { summary: 'Create User' },
    responses: [{ status: 201, description: 'Empty response' }, ApiDocExceptions.forbidden, ApiDocExceptions.badRequest],
  })
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.usersService.create(createUserDto);
  }

  @ApiDoc({
    title: { summary: 'Show all users' },
    responses: [{ status: 200, type: [UserViewAllDTO], description: 'All users' }],
  })
  @SerializeView(UserViewAllDTO)
  @Get()
  findAll(): Promise<UserViewAllDTO[]> {
    return this.usersService.findAll();
  }

  @ApiDoc({
    title: { summary: 'Show User info for self' },
    responses: [
      { status: 200, type: UserSelfView, description: 'User info for self' },
      ApiDocExceptions.unauthorized,
      ApiDocExceptions.forbidden,
    ],
    auth: 'bearer',
  })
  @SerializeView(UserSelfView)
  @UseGuards(JwtAuthGuard, UserGuard)
  @Get('me')
  async findOne(@RequestUser() user: UserInternalView): Promise<UserInternalView> {
    return user;
  }

  @ApiDoc({
    title: { summary: 'Update User' },
    responses: [
      { status: 200, description: 'Empty response' },
      ApiDocExceptions.unauthorized,
      ApiDocExceptions.forbidden,
      ApiDocExceptions.badRequest,
    ],
    auth: 'bearer',
  })
  @UseGuards(JwtAuthGuard, UserGuard)
  @Patch()
  async update(@RequestUser() user: UserInternalView, @Body() updateUserDto: UpdateUserDto): Promise<void> {
    await this.usersService.update(user, updateUserDto);
  }

  @ApiDoc({
    title: { summary: 'Delete User' },
    responses: [{ status: 200, description: 'Empty response' }, ApiDocExceptions.unauthorized, ApiDocExceptions.forbidden],
    auth: 'bearer',
  })
  @UseGuards(JwtAuthGuard, UserGuard)
  @Delete()
  async delete(@RequestUser() user: UserInternalView): Promise<void> {
    await this.usersService.delete(user);
  }
}
