import {Injectable} from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { UserRepository } from "./repository/user.repository";
import { UpdateUserDto } from "./dto/update-user.dto";
import { authFailure, dbFailure, userFailure } from "src/constants/failureConstants";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { User } from "./entity/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ){}

  async showAllUsers(): Promise<UserDto[]>{
    return (await this.userRepository.getUserList());
  }

  async checkUser(username: string){
    const a = {
      username: username,
      available: await this.userRepository.userExists(username)
    }

    console.log(a);
    return a;
  }

  async addNewUser(newUserData: UserDto){
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

  async deleteUser(username: string) {
    const deletedUser = await this.userRepository.deleteUser(username);
    if (!deletedUser) {
      return {
        success: false,
        message: userFailure.USER_NOT_FOUND,
      };
    }

    return {
      success: true,
      message: 'User successfully deleted',
    };
  }

  async authUser(userLogin: LoginUserDto) {
    const user = await this.userRepository.isUserRegistered(userLogin.username);
    
    if (!user) {
      return {
        success: false,
        message: userFailure.USER_NOT_FOUND
      };
    }

    const isPasswordValid = await this.userRepository.authenticateUser(userLogin.username, userLogin.pass);
    
    if (!isPasswordValid) {
      return {
        success: false,
        message: authFailure.INVALID_CREDENTIALS
      };
    }

    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      success: true,
      accessToken
    };
  }
}