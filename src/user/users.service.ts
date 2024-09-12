import {Injectable} from "@nestjs/common";
import { UserRepository } from "./repository/user.repository";
import { UpdateUserDto } from "./dto/update-user.dto";
import { dbFailure, userFailure } from "../constants/failureConstants";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { userSuccess } from "../constants/successConstants";
import { CreateUserDto } from "./dto/create-user.dto";
import { SafeTransferUserDto } from "./dto/share-user.dto";

@Injectable()
export class UsersService {
  constructor(
    // @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ){}

  async showAllUsers(): Promise<SafeTransferUserDto[]>{
    return (await this.userRepository.getUserList());
  }

  async checkUser(username: string){
    const usr= {
      username: username,
      available: await this.userRepository.userExists(username)
    }
    return usr;
  }

  async addNewUser(newUserData: CreateUserDto){
    console.log(newUserData);
    newUserData.pass = await bcrypt.hash(newUserData.pass, Number(process.env.SALT_ROUNDS));
    return (await this.userRepository.addUser(newUserData));
  }
  
  async updateUser(username: string, dataToUpdate: UpdateUserDto) {
    const updatedUser = await this.userRepository.updateUser(username, dataToUpdate);
    if (!updatedUser) {
      return {
        success: false,
        message: userFailure.USER_NOT_FOUND,
      };
    }

    return {
      success: true,
      user: updatedUser,
    };
  }


  async deleteUser(username: string, userId: string) {
    const user = await this.userRepository.isUserRegistered(username);
    if (!user) {
      return({
        resp: dbFailure.DB_ITEM_NOT_DELETED,
        message: dbFailure.DB_ITEM_NOT_FOUND
      });
    }

    try{
      await this.userRepository.softDelete(userId);
      return({
        resp: userSuccess.USER_DELETED
      })
    }
    catch(error){
      console.log(error);
    }

    return({
      resp: userFailure.USER_NOT_DELETED
    })
  }
}