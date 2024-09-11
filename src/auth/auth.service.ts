import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { authFailure, authSuccess, userFailure } from 'src/constants/failureConstants';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserRepository } from 'src/user/repository/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async login(user: LoginUserDto) {
    const validatedUser = await this.userRepository.isUserRegistered(user.username);
    if (!validatedUser) {
      return { 
        resp: authFailure.FAILURE, 
        message: userFailure.USER_NOT_FOUND 
      };
    }

    if(!await this.userRepository.authenticateUser(user.username, user.pass)){
      return { 
        resp: authFailure.FAILURE, 
        message: authFailure.INVALID_CREDENTIALS
      };
    }
    
    const payload = { username: validatedUser.username, sub: validatedUser.id };
    return { 
      resp: authSuccess.SUCCESS, 
      token: await this.jwtService.signAsync(payload)
    };
  }
}