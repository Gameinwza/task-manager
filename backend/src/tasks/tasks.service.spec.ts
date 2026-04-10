import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

describe('TasksService', () => {
  let service: TasksService;

  const mockTaskRepository = {
    find: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockReturnValue({ id: 1, title: 'Test', isDone: false }),
    save: jest.fn().mockResolvedValue({ id: 1, title: 'Test', isDone: false }),
    findOne: jest
      .fn()
      .mockResolvedValue({ id: 1, title: 'Test', isDone: false }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });
  it('ควร Search Task ได้', async () => {
    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest
        .fn()
        .mockResolvedValue([{ id: 1, title: 'Buy coffee', isDone: false }]),
    };

    jest
      .spyOn(mockTaskRepository, 'createQueryBuilder')
      .mockReturnValue(mockQueryBuilder as any);

    const result = await service.findAll(1, 'coffee');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Buy coffee');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('ควรดึง Tasks ได้', async () => {
    const result = await service.findAll(1);
    expect(Array.isArray(result)).toBe(true);
  });

  it('ควรสร้าง Task ได้', async () => {
    const result = await service.create('Test Task', 1);
    expect(result.title).toBe('Test');
  });
});
