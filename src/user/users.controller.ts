import {Body, Controller, Get, Param, Post, SerializeOptions} from "@nestjs/common";
import { User } from "./entity/user.entity";
import { UserRepository } from "./repository/user.repository";
import { UserDto } from "./dto/user.dto";
import { UsersService } from "./users.service";
import { Repository } from "typeorm";

@Controller("users")
export class UsersController {

  constructor( 
    private userService: UsersService
  ){}

  @Get()  
  async showAllUsers(){
    return await this.userService.showAllUsers();
  }
  
  @Post("addUser")
  async addNewUser(@Body() newUserData: UserDto){
    return this.userService.addNewUser(newUserData);
  }

  @Get(":username")
  // checkUser(@Param("userId", ParseIntPipe) userId: string){
  async checkUser(@Param("username") username: string){
    this.userService.checkUser(username);
  }
} 