import {Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entity/user.entity";
import { Repository } from "typeorm";
import { UserDto } from "./dto/user.dto";
import { userCreationFailure } from "src/constants/failureConstants";
import { UserRepository } from "./repository/user.repository";
import { AppDataSource } from "src/appDataSource";

@Injectable()
export class UsersService {
  constructor(){}
    // @InjectRepository(UserRepository) //only usble for type orm generated repository
    // private userRepository: Repository<User> = AppDataSource.getRepository(UserRepository),
  // ){}

  async showAllUsers(): Promise<UserDto[]>{
    return (await UserRepository.getUserList());
  }

  async checkUser(username: string){
    const a = {
      username: username,
      available: await UserRepository.userExists(username)
    }

    console.log(a);
    return a;
  }

  async addNewUser(newUserData: UserDto){
    console.log(newUserData);
    // if(await UserRepository.isEmailRegistered(newUserData.email)){
    //   return ({
    //     status: userCreationFailure.FAILURE,
    //     message: userCreationFailure.EMAIL_ALREADY_REGISTERED,
    //   });
    // }
    // if(await UserRepository.isUsernameRegistered(newUserData.username)){
    //   return ({
    //     status: userCreationFailure.FAILURE,
    //     message: userCreationFailure.USERNAME_ALREADY_TAKEN,
    //   });
    // }

    return (await UserRepository.addUser(newUserData));
  }
}