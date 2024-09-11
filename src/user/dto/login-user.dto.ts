import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginUserDto{
  
  @IsNotEmpty()
  @IsEmail()
  username: string;

  @IsNotEmpty()
  pass: string;
}