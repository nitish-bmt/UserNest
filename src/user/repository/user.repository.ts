import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entity/user.entity";

import { Repository } from "typeorm";
import { UserDto } from "../dto/user.dto";
import { plainToInstance } from "class-transformer";
import { dbFailure } from "src/constants/failureConstants";
import { userCreationSuccess } from "src/constants/successConstants";

@Injectable()
export class UserRepository extends Repository<User>{

  constructor( 
    @InjectRepository(User) 
    private userRepository:Repository<User>
  ){
    super(userRepository.target,
       userRepository.manager,
       userRepository.queryRunner
    );
  }

  async isUsernameRegistered(username: string){
    const result = await this.userRepository.findBy({
      username: username,
    });

    return (result!=null);
  }

  async isEmailRegistered(email: string){
    const result = await this.userRepository.findBy({
      email: email,
    });

    return (result!=null);
  }

  async userExists(username: string): Promise<string>{
    if(this.isUsernameRegistered(username)) return `user: ${username} exists.`;

    return `user: ${username} doesn't exist.`;
  }

  async getUserList(): Promise<UserDto[]>{
    const result = await this.userRepository.find();
    const users: UserDto[] = result.map((usr)=>plainToInstance(UserDto, usr));
    return users;
  }

  async addUser(newUserData: UserDto){
    try{
      const usr = await this.userRepository.create(newUserData);
      console.log("hhhh", usr);
      await this.userRepository.save(usr);
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