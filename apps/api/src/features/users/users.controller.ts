import { Controller, Get, Body, Patch, UseGuards, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UpdateUserDto, CreateUserDto, UserEmailDTO } from './dto/input';
import { UserViewAllDTO, UserSelfView, UserInternalView } from './dto/view';
import { RolesGuard, UserGuard } from './guards';
import { ApiDoc } from '@app/api-doc';
import { ApiDocExceptions } from '@app/api-doc/responses';
import { SerializeView } from '@app/serializer';
import { JwtAuthGuard } from '@app/auth/guards';
import { RequestUser } from '../../decorators';
import { Roles } from '@app/auth/decorators';
import { ROLE } from '@app/auth/const';
import { AuthService } from '@app/auth/auth.service';

@ApiTags('Users')
// @Roles(ROLE.USER)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

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
  @Roles([ROLE.ADMIN])
  @UseGuards(JwtAuthGuard, UserGuard, RolesGuard)
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
  @Roles([ROLE.USER])
  @UseGuards(JwtAuthGuard, UserGuard, RolesGuard)
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
  @Roles([ROLE.USER])
  @UseGuards(JwtAuthGuard, UserGuard, RolesGuard)
  @Patch()
  async update(@RequestUser() user: UserInternalView, @Body() updateUserDto: UpdateUserDto): Promise<void> {
    await this.usersService.update(user, updateUserDto);
  }

  @ApiDoc({
    title: { summary: 'Ban User' },
    responses: [
      { status: 200, description: 'Empty response' },
      ApiDocExceptions.unauthorized,
      ApiDocExceptions.forbidden,
      ApiDocExceptions.notFound,
      ApiDocExceptions.badRequest,
    ],
    auth: 'bearer',
  })
  @Roles([ROLE.ADMIN])
  @UseGuards(JwtAuthGuard, UserGuard, RolesGuard)
  @Patch('ban')
  async ban(@Query() { email }: UserEmailDTO): Promise<void> {
    return this.authService.banByEmail(email);
  }

  //   @ApiDoc({
  //     title: { summary: 'Delete User' },
  //     responses: [{ status: 200, description: 'Empty response' }, ApiDocExceptions.unauthorized, ApiDocExceptions.forbidden],
  //     auth: 'bearer',
  //   })
  //   @Roles([ROLE.USER])
  //   @UseGuards(JwtAuthGuard, UserGuard, RolesGuard)
  //   @Delete()
  //   async delete(@RequestUser() user: UserInternalView): Promise<void> {
  //     await this.usersService.delete(user);
  //   }
}
