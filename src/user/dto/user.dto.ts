// import { Prop } from "@nestjs/mongoose";
// import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsNotEmpty} from "class-validator";

// data transfer object
export class UserDto{

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

  contact: string;

}