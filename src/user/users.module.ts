import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entity/user.entity";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { DataSource } from "typeorm";
import { UserRepository } from "./repository/user.repository";
import { AuthService } from "../auth/auth.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRepository]),
    // AuthService
  ],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
  exports: [TypeOrmModule, UserRepository],
})
export class UsersModule {
  constructor(private dataSource: DataSource){}
}