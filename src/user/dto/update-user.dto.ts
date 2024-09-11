// import { Prop } from "@nestjs/mongoose";
// import { Exclude, Expose } from "class-transformer";
import {IsAlphanumeric, IsEmail, IsNotEmpty, IsOptional} from "class-validator";

// data transfer object
export class UpdateUserDto{

  @IsNotEmpty()
  username: string;
  
  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  contact: string;
}