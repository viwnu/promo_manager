import { Body, Controller, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiDoc } from '@app/decorators/api-doc';
import { ApiDocExceptions } from '@app/decorators/api-doc/reponses';
import { RequestProp } from '@app/decorators/param';
import { AuthService } from './auth.service';
import { LocalAuthGuard, JwtAuthGuard } from './guards';
import { CreateUserIdentityModel, RefreshToken, UserIdentityDTO } from './dto/input';
import { SetAccessToken, ClearAccessToken } from './interceptors';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiDoc({
    title: 'Login User and return refresh_token',
    response: { status: 201, type: RefreshToken, description: 'refresh_token' },
    exceptions: [ApiDocExceptions.unauthorized, ApiDocExceptions.badRequest],
    requestBody: { type: CreateUserIdentityModel, description: 'login data' },
  })
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(SetAccessToken)
  @Post('login')
  async login(@RequestProp('user') user: UserIdentityDTO) {
    return await this.authService.login(user);
  }

  @ApiDoc({
    title: 'Refresh and return refresh_token',
    response: { status: 201, type: RefreshToken, description: 'refresh_token' },
    exceptions: [ApiDocExceptions.unauthorized, ApiDocExceptions.badRequest],
  })
  @UseInterceptors(SetAccessToken)
  @Post('refresh')
  async refresh(@Body() refreshTokenInput: RefreshToken) {
    return await this.authService.refreshTokens(refreshTokenInput.refresh_token);
  }

  @ApiDoc({
    title: 'Logout User clear cookies delete refreshToken',
    response: { status: 200, description: 'Empty response' },
    exceptions: [ApiDocExceptions.unauthorized],
    auth: 'bearer',
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClearAccessToken)
  @Patch()
  async logout(@RequestProp('user') user: UserIdentityDTO): Promise<void> {
    await this.authService.logout(user);
  }

  // @ApiDoc({
  //   title: 'Delete User',
  //   response: { status: 200, description: 'Empty response' },
  //   exceptions: [ApiDocExceptions.unauthorized],
  //   auth: 'bearer',
  // })
  // @UseGuards(JwtAuthGuard)
  // @Delete()
  // async remove(@RequestProp('user') user: UserIdentityDTO): Promise<void> {
  //   await this.authService.remove(user);
  // }
}
