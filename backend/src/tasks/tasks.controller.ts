import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

interface RequestWithUser extends Request {
  user: { id: number; email: string };
}

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  findAll(@Request() req: RequestWithUser, @Query('search') search?: string) {
    return this.tasksService.findAll(req.user.id, search);
  }

  @Post()
  create(@Body() body: { title: string }, @Request() req: RequestWithUser) {
    return this.tasksService.create(body.title, req.user.id);
  }

  @Patch(':id')
  toggle(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.tasksService.toggleDone(+id, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.tasksService.remove(+id, req.user.id);
  }
}
