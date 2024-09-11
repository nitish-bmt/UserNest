import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/user/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        global: true,
        secret: `${process.env.JWT_KEY}`,
        signOptions: { expiresIn: 5*60000 } 
      }),
    })  
  ],
  providers: [AuthService ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}