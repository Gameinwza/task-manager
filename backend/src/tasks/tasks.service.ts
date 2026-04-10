import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findAll(userId: number, search?: string): Promise<Task[]> {
    const query = this.tasksRepository
      .createQueryBuilder('task')
      .where('task.userId = :userId', { userId });

    if (search) {
      query.andWhere('task.title ILIKE :search', { search: `%${search}%` });
    }

    return query.getMany();
  }

  async create(title: string, userId: number): Promise<Task> {
    const task = this.tasksRepository.create({
      title,
      user: { id: userId },
    });
    return this.tasksRepository.save(task);
  }

  async toggleDone(id: number, userId: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!task) throw new Error('Task not found');
    task.isDone = !task.isDone;
    return this.tasksRepository.save(task);
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.tasksRepository.delete({ id, user: { id: userId } });
  }
}
