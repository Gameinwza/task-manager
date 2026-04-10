import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    findOne: jest.fn().mockResolvedValue({ id: 1, email: 'test@test.com' }),
    create: jest.fn().mockReturnValue({ id: 1, email: 'test@test.com' }),
    save: jest.fn().mockResolvedValue({ id: 1, email: 'test@test.com' }),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('ควรหา User ได้', async () => {
    const result = await service.findOne('test@test.com');
    expect(result?.email).toBe('test@test.com');
  });
});
