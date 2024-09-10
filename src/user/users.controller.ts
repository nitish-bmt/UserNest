import {Body, Controller, Get, Param, Post, SerializeOptions} from "@nestjs/common";
import { UserEntity } from "./entity/user.entity";
import { UserRepository } from "./repository/user.repository";
import { UserDto } from "./dto/user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {

  constructor( 
    private userRepository: UserRepository,
    private userService: UsersService
  ){}

  @Get()  
  async showAllUsers(){
    return await this.userRepository.getUserList();
  }
  
  @Post("addUser")
  async addUser(@Body() newUserData: UserDto){
    return this.userService.addNewUser(newUserData);
  }

  @Get(":username")
  // checkUser(@Param("userId", ParseIntPipe) userId: string){
  async checkUser(@Param("username") username: string){
    return {
      username: username,
      available: await this.userRepository.userExists(username)
    }
  }
} 