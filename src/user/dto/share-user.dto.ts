// import { Prop } from "@nestjs/mongoose";
// import { Exclude, Expose } from "class-transformer";
import { Exclude } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumberString} from "class-validator";

// data transfer object
export class SafeTransferUserDto{

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  username: string;

  @Exclude()
  @IsNotEmpty()
  pass: string;

  @Exclude()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNumberString()
  contact: string;

}