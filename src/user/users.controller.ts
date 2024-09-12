import {Body, Controller, Delete, Get, Param, Patch, Post} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Public } from "src/utils/customDecorator/user.decorator";
import { Request } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller("users")
export class UsersController {

  constructor( 
    private userService: UsersService
  ){}

  
  @Public()
  @Post("addUser")
  async addNewUser(@Body() newUserData: CreateUserDto){
    return this.userService.addNewUser(newUserData);
  }
  
  @Get()  
  async showAllUsers(){
    return await this.userService.showAllUsers();
  }

  @Patch("updateUser")
  async updateUser(@Request() req){
    const dataToUpdate: UpdateUserDto = req.body;
    const {userId, username} = req.user;
    return this.userService.updateUser(username, dataToUpdate);
  }

  @Get(":username")
  async checkUser(@Param("username") username: string){
    this.userService.checkUser(username);
  }

  @Delete("deleteUser")
  async deleteUser(@Request() req){
    const {userId, username} = req.user;
    return this.userService.deleteUser(username, userId);
  }
} 