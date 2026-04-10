import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('ควร Register สำเร็จ', async () => {
      mockUsersService.create.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      });

      const result = await service.register('test@test.com', '123456');
      expect(result).toEqual({ id: 1, email: 'test@test.com' });
    });
  });

  describe('login', () => {
    it('ควร Login สำเร็จและได้ Token', async () => {
      const hashed = await bcrypt.hash('123456', 10);
      mockUsersService.findOne.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: hashed,
      });

      const result = await service.login('test@test.com', '123456');
      expect(result).toEqual({ access_token: 'mock-token' });
    });

    it('ควร Throw UnauthorizedException ถ้า User ไม่มี', async () => {
      mockUsersService.findOne.mockResolvedValue(null);
      await expect(service.login('wrong@test.com', '123456')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('ควร Throw UnauthorizedException ถ้า Password ผิด', async () => {
      const hashed = await bcrypt.hash('correct', 10);
      mockUsersService.findOne.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: hashed,
      });
      await expect(service.login('test@test.com', 'wrong')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
