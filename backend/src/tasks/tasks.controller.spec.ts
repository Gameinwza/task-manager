import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;

  const mockTasksService = {
    findAll: jest.fn().mockResolvedValue([]),
    create: jest
      .fn()
      .mockResolvedValue({ id: 1, title: 'Test', isDone: false }),
    toggleDone: jest
      .fn()
      .mockResolvedValue({ id: 1, title: 'Test', isDone: true }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockTasksService }],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('ควรดึง Tasks ได้', async () => {
    const req = { user: { id: 1, email: 'test@test.com' } };
    const result = await controller.findAll(req as any);
    expect(result).toEqual([]);
  });
});
