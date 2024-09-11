import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entity/user.entity";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { DataSource } from "typeorm";
import { UserRepository } from "./repository/user.repository";
import { AuthService } from "src/auth/auth.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRepository]),
    // AuthService
  ],
  providers: [UsersService, UserRepository, AuthService, JwtService],
  controllers: [UsersController],
  exports: [TypeOrmModule, UsersService, UserRepository],
})
export class UsersModule {
  constructor(private dataSource: DataSource){}
}