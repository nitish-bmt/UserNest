// import { Prop } from "@nestjs/mongoose";
// import { Exclude, Expose } from "class-transformer";
import {IsOptional} from "class-validator";

// data transfer object
export class UpdateUserDto{
  
  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  contact?: string;
}