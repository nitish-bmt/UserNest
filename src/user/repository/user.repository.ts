import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { constrainedMemory } from "process";
import { UserEntity } from "src/user/entity/user.entity";

import { DataSource, Repository } from "typeorm";
import { UserDto } from "../dto/user.dto";
import { plainToInstance } from "class-transformer";
import { dbFailure } from "src/constants/failureConstants";
import { userCreationSuccess } from "src/constants/successConstants";

@Injectable()
export class UserRepository extends Repository<UserEntity>{

  constructor( private dataSource: DataSource){
    super(UserEntity, dataSource.createEntityManager());
  }

  async isUsernameRegistered(username){
    const result = await this.findBy({
      username: username,
    });

    return (result!=null);
  }

  async isEmailRegistered(email){
    const result = await this.findBy({
      email: email,
    });

    return (result!=null);
  }

  async userExists(username: string): Promise<string>{
    if(this.isUsernameRegistered(username)) return `user: ${username} exists.`;

    return `user: ${username} doesn't exist.`;
  }

  async getUserList(): Promise<UserDto[]>{
    const result = await this.find();
    const users: UserDto[] = result.map((usr)=>plainToInstance(UserDto, usr));
    return users;
  }

  async addUser(newUserData: UserDto){
    try{
      await this.insert(newUserData);
    }
    catch(error){
      console.log(error);
      return({
        response: dbFailure.DB_WRITE_FAILURE,
      })
    }

    return({
      response: userCreationSuccess.SUCCESS,
    });
  }
 
}