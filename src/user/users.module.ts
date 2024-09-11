import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entity/user.entity";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { DataSource } from "typeorm";
import { UserRepository } from "./repository/user.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRepository]),
  ],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
  exports: [TypeOrmModule, UsersService, UserRepository],
})
export class UsersModule {
  constructor(private dataSource: DataSource){}
}