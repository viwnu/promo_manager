import { Controller, Get, Body, Patch, UseGuards, Post, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/auth/guards';
import { SerializeView } from '@app/decorators/serializer';
import { ApiDoc } from '@app/decorators/api-doc';
import { ApiDocExceptions } from '@app/decorators/api-doc/reponses';
import { RequestUser } from '../../shared/decorators';
import { UsersService } from './users.service';
import { UpdateUserDto, CreateUserDto } from './dto/input';
import { UserViewAllDTO, UserSelfView, UserInternalView } from './dto/view';
import { UserGuard } from './guards';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiDoc({
    title: 'Create User',
    response: { status: 201, description: 'Empty response' },
    exceptions: [ApiDocExceptions.forbidden, ApiDocExceptions.badRequest],
  })
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.usersService.create(createUserDto);
  }

  @ApiDoc({
    title: 'Show all users',
    response: { status: 200, type: [UserViewAllDTO], description: 'All users' },
  })
  @SerializeView(UserViewAllDTO)
  @Get()
  findAll(): Promise<UserViewAllDTO[]> {
    return this.usersService.findAll();
  }

  @ApiDoc({
    title: 'Show User info for self',
    response: { status: 200, type: UserSelfView, description: 'User info for self' },
    exceptions: [ApiDocExceptions.unauthorized, ApiDocExceptions.forbidden],
    auth: 'bearer',
  })
  @SerializeView(UserSelfView)
  @UseGuards(JwtAuthGuard, UserGuard)
  @Get('me')
  async findOne(@RequestUser() user: UserInternalView): Promise<UserInternalView> {
    return user;
  }

  @ApiDoc({
    title: 'Update User',
    response: { status: 200, description: 'Empty response' },
    exceptions: [ApiDocExceptions.unauthorized, ApiDocExceptions.forbidden, ApiDocExceptions.badRequest],
    auth: 'bearer',
  })
  @UseGuards(JwtAuthGuard, UserGuard)
  @Patch()
  async update(@RequestUser() user: UserInternalView, @Body() updateUserDto: UpdateUserDto): Promise<void> {
    await this.usersService.update(user, updateUserDto);
  }

  @ApiDoc({
    title: 'Delete User',
    response: { status: 200, description: 'Empty response' },
    exceptions: [ApiDocExceptions.unauthorized, ApiDocExceptions.forbidden],
    auth: 'bearer',
  })
  @UseGuards(JwtAuthGuard, UserGuard)
  @Delete()
  async delete(@RequestUser() user: UserInternalView): Promise<void> {
    await this.usersService.delete(user);
  }
}
