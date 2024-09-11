import {Injectable} from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { UserRepository } from "./repository/user.repository";

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
  ){}

  async showAllUsers(): Promise<UserDto[]>{
    return (await this.userRepository.getUserList());
  }

  async checkUser(username: string){
    const a = {
      username: username,
      available: await this.userRepository.userExists(username)
    }

    console.log(a);
    return a;
  }

  async addNewUser(newUserData: UserDto){
    console.log(newUserData);
    return (await this.userRepository.addUser(newUserData));
  }
}