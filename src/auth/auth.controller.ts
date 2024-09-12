import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { Public } from '../utils/customDecorator/user.decorator';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService){}

  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}