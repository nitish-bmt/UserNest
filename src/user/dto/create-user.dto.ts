// import { Prop } from "@nestjs/mongoose";
// import { Exclude, Expose } from "class-transformer";
import { Exclude } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumberString} from "class-validator";

// data transfer object
export class CreateUserDto{

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  pass: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNumberString()
  contact: string;

}