import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Public } from "src/utils/customDecorator/user.decorator";
import { Request } from "@nestjs/common";

@Controller("users")
export class UsersController {

  constructor( 
    private userService: UsersService
  ){}

  
  @Public()
  @Post("addUser")
  async addNewUser(@Body() newUserData: UserDto){
    return this.userService.addNewUser(newUserData);
  }
  
  @Get()  
  async showAllUsers(){
    return await this.userService.showAllUsers();
  }

  @Post("updateUser")
  async updateUser(@Request() req){
    const dataToUpdate: UpdateUserDto = req.body;
    const {userId, username} = req.user;
    return this.userService.updateUser(username, dataToUpdate);
  }

  @Get(":username")
  async checkUser(@Param("username") username: string){
    this.userService.checkUser(username);
  }
} 