import { Body, Controller, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RequestProp } from 'libs/shared/decorators/param';
import { AuthService } from './auth.service';
import { LocalAuthGuard, JwtAuthGuard } from './guards';
import { CreateUserIdentityModel, RefreshToken, UserIdentityDTO } from './dto/input';
import { SetAccessToken, ClearAccessToken } from './interceptors';
import { ApiDoc } from '@app/api-doc';
import { ApiDocExceptions } from '@app/api-doc/responses';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiDoc({
    title: { summary: 'Login User and return refresh_token' },
    body: { type: CreateUserIdentityModel, description: 'login data' },
    responses: [
      { status: 201, type: RefreshToken, description: 'refresh_token' },
      ApiDocExceptions.unauthorized,
      ApiDocExceptions.badRequest,
    ],
  })
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(SetAccessToken)
  @Post('login')
  async login(@RequestProp('user') user: Omit<UserIdentityDTO, 'active'>) {
    return await this.authService.login(user);
  }

  @ApiDoc({
    title: { summary: 'Refresh and return refresh_token' },
    responses: [ApiDocExceptions.unauthorized, ApiDocExceptions.badRequest],
  })
  @UseInterceptors(SetAccessToken)
  @Post('refresh')
  async refresh(@Body() refreshTokenInput: RefreshToken) {
    return await this.authService.refreshTokens(refreshTokenInput.refresh_token);
  }

  @ApiDoc({
    title: { summary: 'Logout User clear cookies delete refreshToken' },
    responses: [{ status: 200, description: 'Empty response' }, ApiDocExceptions.unauthorized],
    auth: 'bearer',
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClearAccessToken)
  @Patch()
  async logout(@RequestProp('user') user: Omit<UserIdentityDTO, 'active'>): Promise<void> {
    await this.authService.logout(user);
  }

  // @ApiDoc({
  //   title: {summary: 'Delete User'},
  //   responses: [{ status: 200, description: 'Empty response' }, ApiDocExceptions.unauthorized],
  //   auth: 'bearer',
  // })
  // @UseGuards(JwtAuthGuard)
  // @Delete()
  // async remove(@RequestProp('user') user: UserIdentityDTO): Promise<void> {
  //   await this.authService.remove(user);
  // }
}
