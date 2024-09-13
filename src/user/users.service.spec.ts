import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { SafeTransferUserDto } from "./dto/share-user.dto";
import { AuthService } from "../auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "./repository/user.repository";
import { CreateUserDto } from "./dto/create-user.dto";
import { userSuccess } from "../constants/successConstants";
import { dbFailure, userFailure } from "../constants/failureConstants";
import { UpdateUserDto } from "./dto/update-user.dto";

// Unit test for the UsersService
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

    // test case 1
    it('should return an array of users', async () => {

      // expected result
      const result: SafeTransferUserDto[] = [
        { firstName: 'test', lastName: '1', username: 'test1', email: 'test1@example.com', contact: '1234567890', pass: 'xyz' },
        { firstName: 'test', lastName: '2', username: 'test2', email: 'test2@example.com', contact: '1234567890', pass: 'xyz'},
      ];

      // mocking repo method call
      jest.spyOn(mockUserRepository, 'getUserList').mockResolvedValue(result);

      // conforming the result
      expect(await service.showAllUsers()).toBe(result);

      // conforming the mockUserRepository method is called
      expect(mockUserRepository.getUserList).toHaveBeenCalled();
    });

    // test case 2
    it('should return an empty array when no users exist', async () => {

      // expected result
      const result:SafeTransferUserDto[] = [];

      // mock repo method call
      jest.spyOn(mockUserRepository, 'getUserList').mockResolvedValue(result);

      // conforming the result
      expect(await service.showAllUsers()).toBe(result);

      // conforming the mockUserRepository method is called
      expect(mockUserRepository.getUserList).toHaveBeenCalled();
    });

    // test case 3
    it('should throw an error when database operation fails', async () => {
      const error = new Error('Database error');
      mockUserRepository.getUserList.mockRejectedValue(error);

      // conforming the result
      await expect(service.showAllUsers()).rejects.toThrow('Database error');
    });
                
  });

  // // tests for checkUser method
  describe('checkUser', () => {

    // test case 1
    it('should return response with available: true when the username exists', async () => {

      // mocking
      const username = "existingUser";
      const mockResult = `user: ${username} exists.`;
      mockUserRepository.userExists.mockResolvedValue(mockResult);

      const result = await service.checkUser(username);
      expect(result).toEqual({
        username: username,
        available: mockResult
      });
    });

    // test case 2
    it('should return response with available: false when the username does not exist', async () => {

      // mocking
      const username = "nonexistentUser";
      const mockResult = `user: ${username} does not exist.`
      mockUserRepository.userExists.mockResolvedValue(mockResult);

      const result = await service.checkUser(username);

      // conforming the result
      expect(result).toEqual({
        username: username,
        available: mockResult
      });
    });

    // test case 3
    it('should handle errors from userExists method', async () => {

      // mocking
      const username = "errorUser";
      mockUserRepository.userExists.mockRejectedValue(new Error('Database error'));

      // conforming the result
      await expect(service.checkUser(username)).rejects.toThrow('Database error');
    });
  });

  // tests for addNewUSer method
  describe('addNewUser', () => {

    // test case 1
    it('should add a new user successfully', async () => {

      // mocking
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

      // conforming the result
      expect(result).toEqual({ ...newUser, pass: hashedPassword });

      // conforming the mockUserRepository method is called
      expect(mockUserRepository.addUser).toHaveBeenCalled();
    });

    // test case 2
    it('should handle errors when adding a new user', async () => {

      // mocking
      const newUser: CreateUserDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        username: 'janedoe',
        email: 'jane@example.com',
        contact: '0987654321',
        pass: 'password456'
      };
      mockUserRepository.addUser.mockRejectedValue(new Error('Database error'));

      // conforming the result
      await expect(service.addNewUser(newUser)).rejects.toThrow('Database error');
    });
  });

  // tests for updateUser method
  describe('updateUser', () => {

    // test case 1
    it('should update user successfully', async () => {

      // mocking
      const username = 'johndoe';
      const updateData: UpdateUserDto = { firstName: 'John Updated' };
      const updatedUser = { username, ...updateData };
      mockUserRepository.updateUser.mockResolvedValue(updatedUser);

      const result = await service.updateUser(username, updateData);

      // conforming the result
      expect(result).toEqual({ success: true, user: updatedUser });
    });

    // test case 2
    it('should return failure when user not found', async () => {

      // mocking
      const username = 'nonexistent';
      const updateData: UpdateUserDto = { firstName: 'John Updated' };
      mockUserRepository.updateUser.mockResolvedValue(null);

      const result = await service.updateUser(username, updateData);

      // conforming the result
      expect(result).toEqual({ success: false, message: userFailure.USER_NOT_FOUND });
    });

    // test case 3
    it('should handle errors during user update', async () => {

      // mocking
      const username = 'errorUser';
      const updateData: UpdateUserDto = { firstName: 'Error User' };
      mockUserRepository.updateUser.mockRejectedValue(new Error('Database error'));

      // conforming the result
      await expect(service.updateUser(username, updateData)).rejects.toThrow('Database error');
    });
  });


  // tests for deleteUser method
  describe('deleteUser', () => {
    
    // test case 1
    it('should delete user successfully', async () => {

      // mocking
      const username = 'johndoe';
      const userId = '123';
      mockUserRepository.isUserRegistered.mockResolvedValue(true);
      mockUserRepository.softDelete.mockResolvedValue(undefined);

      const result = await service.deleteUser(username, userId);

      // conforming the result
      expect(result).toEqual({ resp: userSuccess.USER_DELETED });

      // conforming the mockUserRepository method is called
      expect(mockUserRepository.softDelete).toHaveBeenCalledWith(userId);
    });

    // test case 2
    it('should return failure when user not found', async () => {

      // mocking
      const username = 'nonexistent';
      const userId = '456';
      mockUserRepository.isUserRegistered.mockResolvedValue(false);

      const result = await service.deleteUser(username, userId);

      // conforming the result
      expect(result).toEqual({ 
        resp: dbFailure.DB_ITEM_NOT_DELETED,
        message: dbFailure.DB_ITEM_NOT_FOUND 
      });
    });

    // test case 3
    it('should handle errors during user deletion', async () => {

      // mocking
      const username = 'errorUser';
      const userId = '789';
      mockUserRepository.isUserRegistered.mockResolvedValue(true);
      mockUserRepository.softDelete.mockRejectedValue(new Error('Database error'));

      const result = await service.deleteUser(username, userId);

      // conforming the result
      expect(result).toEqual({ resp: userFailure.USER_NOT_DELETED });
    });
  });

});
