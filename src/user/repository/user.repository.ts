import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { Repository } from "typeorm";
import { plainToInstance } from "class-transformer";
import { dbFailure } from "../../constants/failureConstants";
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from "../dto/update-user.dto";
import { userSuccess } from "../../constants/successConstants";
import { SafeTransferUserDto } from "../dto/share-user.dto";
import { CreateUserDto } from "../dto/create-user.dto";

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

    return `user: ${username} does not exist.`;
  }

  async getUserList(): Promise<SafeTransferUserDto[]>{
    const result = await this.userRepository.find();
    const users: SafeTransferUserDto[] = result.map((usr)=>plainToInstance(SafeTransferUserDto, usr));
    return users;
  }

  async addUser(newUserData: CreateUserDto){
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