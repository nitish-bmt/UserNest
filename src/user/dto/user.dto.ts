// import { Prop } from "@nestjs/mongoose";
// import { Exclude, Expose } from "class-transformer";
import {IsAlphanumeric, IsEmail, IsNotEmpty} from "class-validator";

// data transfer object
export class UserDto{

  @IsNotEmpty()
  name: string;
  
  @IsNotEmpty()
  username: string;
  
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  pass: string;
}