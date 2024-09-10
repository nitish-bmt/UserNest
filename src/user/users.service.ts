import {Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entity/user.entity";
import { Repository } from "typeorm";
import { UserDto } from "./dto/user.dto";
import { UserRepository } from "./repository/user.repository";
import { userCreationFailure } from "src/constants/failureConstants";

@Injectable()
export class UsersService {
  constructor(
    // @InjectRepository(UserRepository) //only usble for type orm generated repository
    private userRepository: UserRepository,
  ){}

  addNewUser(newUserData: UserDto){
    if(this.userRepository.isEmailRegistered(newUserData.email)){
      return ({
        status: userCreationFailure.FAILURE,
        message: userCreationFailure.EMAIL_ALREADY_REGISTERED,
      });
    }
    if(this.userRepository.isUsernameRegistered(newUserData.username)){
      return ({
        status: userCreationFailure.FAILURE,
        message: userCreationFailure.USERNAME_ALREADY_TAKEN,
      });
    }

    return this.userRepository.addUser(newUserData);
  }
}