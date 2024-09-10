import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entity/user.entity";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { DataSource } from "typeorm";
import { UserRepository } from "./repository/user.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserRepository]),
  ],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {
  constructor(private dataSource: DataSource){}
}