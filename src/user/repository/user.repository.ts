import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entity/user.entity";
import { Repository } from "typeorm";
import { UserDto } from "../dto/user.dto";
import { plainToInstance } from "class-transformer";
import { dbFailure } from "src/constants/failureConstants";
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from "../dto/update-user.dto";
import { userSuccess } from "src/constants/successConstants";

@Injectable()
export class UserRepository extends Repository<User>{

  constructor( 
    @InjectRepository(User) 
    private userRepository: Repository<User>
  ){
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  async isUserRegistered(username: string){
    const result = await this.userRepository.findOneBy({
      username: username,
    });
    return result
  }

  // SoftDeleteQueryBuilder<User>
  async isEmailRegistered(email: string){
    const result = await this.userRepository.findBy({
      email: email,
    });

    return (result!=null);
  }

  async userExists(username: string): Promise<string>{
    if(this.isUserRegistered(username)) return `user: ${username} exists.`;

    return `user: ${username} doesn't exist.`;
  }

  async getUserList(): Promise<UserDto[]>{
    const result = await this.userRepository.find();
    const users: UserDto[] = result.map((usr)=>plainToInstance(UserDto, usr));
    return users;
  }

  async addUser(newUserData: UserDto){
    try{
      const usr = this.userRepository.create(newUserData);
      await this.userRepository.save(usr);
    }
    catch(error){
      console.log(error);
      return({
        response: dbFailure.DB_WRITE_FAILURE,
      })
    }
    
    return({
      response: userSuccess.USER_CREATED,
    });
  }

  async authenticateUser(username: string, password: string){
    const user = await this.isUserRegistered(username);
    if (!user) {
      return false;
    }
    return bcrypt.compare(password, user.pass);
  }

  async updateUser(username: string, updateData: UpdateUserDto){
    const user = await this.isUserRegistered(username);
    if (!user) {
      return null;
    }
    // if (updateData.pass) {
    //   updateData.pass = await bcrypt.hash(updateData.pass, process.env.SALT_ROUNDS);
    // }
    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }
}