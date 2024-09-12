import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { SafeTransferUserDto } from "./dto/share-user.dto";
import { response } from "express";

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
        {
          provide: getRepositoryToken(User),
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
      const result: Error = new Error('Database error');
      // mocking repo method call
      jest.spyOn(mockUserRepository, 'getUserList').mockRejectedValue(result);

      expect(await service.showAllUsers()).toBe(result);
      expect(mockUserRepository.getUserList).toHaveBeenCalled();
    });
                
  });


  describe('checkUser', ()=>{

    // scenario 1
    it('should return response with available: user: username exists when the username exists', async()=>{
      // mock data
      const username = "nitish";
      const result = {
        username: username,
        available: `user: ${username} exists.`
      }

      jest.spyOn(mockUserRepository, 'userExists').mockResolvedValue(result);
      expect(await service.checkUser(username)).toBe(result);
    });

    // scenario 2
    it('should return response with available: user: username does not exists when the username exists', async()=>{
      // mock data
      const username = "nitish";
      const result = {
        username: username,
        available: `user: ${username} does not exist.`
      }

      jest.spyOn(mockUserRepository, 'userExists').mockRejectedValue(result);
      expect(await service.checkUser(username)).toBe(result);
    });               
  });

  // describe('addNewUser', ()=>{
  //   it('', ()=>{});
  //   it('', ()=>{});
  //   it('', ()=>{});
  //   it('', ()=>{});
                
  // });
  // describe('updateUser', ()=>{
  //   it('', ()=>{});
  //   it('', ()=>{});
  //   it('', ()=>{});
  //   it('', ()=>{});
                
  // });
  // describe('deleteUser', ()=>{
  //   it('', ()=>{});
  //   it('', ()=>{});
  //   it('', ()=>{});
  //   it('', ()=>{});
                
  // });

});
