import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { SafeTransferUserDto } from "./dto/share-user.dto";
import { response } from "express";
import { UsersModule } from "./users.module";
import { AuthService } from "../auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "./repository/user.repository";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto/create-user.dto";

describe('UsersService', () => {

  let service: UsersService;

  // mocking required repository for mock injection
  const mockUserRepository = {
    getUserList: jest.fn(),
    addUser: jest.fn(),
    updateUser: jest.fn(),
    userExists: jest.fn(),
    softDelete: jest.fn(),
    isUserRegistered: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthService,
        JwtService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  // test for the service
  it('should be defined', ()=>{
    expect(service).toBeDefined();
  });

  // tests for showAllUsers method
  describe('showAllUsers', ()=>{

    // scenario 1
    it('should return an array of users', async () => {

      // expected result
      const result: SafeTransferUserDto[] = [
        { firstName: 'test', lastName: '1', username: 'test1', email: 'test1@example.com', contact: '1234567890', pass: 'xyz' },
        { firstName: 'test', lastName: '2', username: 'test2', email: 'test2@example.com', contact: '1234567890', pass: 'xyz'},
      ];

      // mocking repo method call
      jest.spyOn(mockUserRepository, 'getUserList').mockResolvedValue(result);

      // conforming the result is sa
      expect(await service.showAllUsers()).toBe(result);
      expect(mockUserRepository.getUserList).toHaveBeenCalled();
    });

    // scenario 2
    it('should return an empty array when no users exist', async () => {

      // expected result
      const result:SafeTransferUserDto[] = [];

      // mock repo method call
      jest.spyOn(mockUserRepository, 'getUserList').mockResolvedValue(result);

      // conforming the result of method call
      expect(await service.showAllUsers()).toBe(result);
      expect(mockUserRepository.getUserList).toHaveBeenCalled();
    });

    // scenario 3
    it('should throw an error when database operation fails', async () => {
      const error = new Error('Database error');
      mockUserRepository.getUserList.mockRejectedValue(error);

      await expect(service.showAllUsers()).rejects.toThrow('Database error');
    });
                
  });

  // tests for addNewUSer service
  describe('addNewUser', () => {

    // scenario 1
    it('should add a new user successfully', async () => {
      const newUser: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        contact: '1234567890',
        pass: 'password123'
      };
      const hashedPassword = 'hashedPassword';
      mockUserRepository.addUser.mockResolvedValue({ ...newUser, pass: hashedPassword });

      const result = await service.addNewUser(newUser);
      expect(result).toEqual({ ...newUser, pass: hashedPassword });

      expect(mockUserRepository.addUser).toHaveBeenCalled();
    });

    // scenario 2
    it('should handle errors when adding a new user', async () => {
      const newUser: CreateUserDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        username: 'janedoe',
        email: 'jane@example.com',
        contact: '0987654321',
        pass: 'password456'
      };
      mockUserRepository.addUser.mockRejectedValue(new Error('Database error'));

      await expect(service.addNewUser(newUser)).rejects.toThrow('Database error');
    });
  });


});
