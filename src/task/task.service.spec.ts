import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './schema/task.schema';
import { TaskStatusEnum } from './task.enum';
import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepository: TaskRepository;

  const mockTaskRepo = {
    createTask: jest.fn(),
    getAllTasks: jest.fn(),
    getTaskById: jest.fn(),
    updateTaskById: jest.fn(),
  };

  const mockTask = {
    id: '96941e06-6069-46fd-bcfe-46ecdce3ed0d',
    status: 'todo',
    title: 'test',
  } as Task;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TaskService,
        TaskRepository,
        {
          provide: getModelToken(Task.name),
          useValue: mockTaskRepo,
        },
      ],
    }).compile();

    taskService = moduleRef.get<TaskService>(TaskService);
    taskRepository = moduleRef.get<TaskRepository>(TaskRepository);
  });

  describe('createTask', () => {
    it('should return created task', async () => {
      const dto = {
        title: 'test',
        status: TaskStatusEnum.TODO,
      } as CreateTaskDto;

      jest.spyOn(taskRepository, 'createTask').mockResolvedValueOnce(mockTask);

      const createdTask = await taskService.createTask(dto);

      expect(createdTask).toEqual(mockTask);
    });
  });

  describe('getAllTasks', () => {
    it('should return two tasks', async () => {
      jest
        .spyOn(taskRepository, 'getAllTasks')
        .mockResolvedValueOnce([mockTask, mockTask]);

      const taskList = await taskService.getAllTasks({});

      expect(taskList).toEqual([mockTask, mockTask]);
    });
  });

  describe('getTaskById', () => {
    it('should return task with correct id', async () => {
      jest.spyOn(taskRepository, 'getTaskById').mockResolvedValueOnce(mockTask);

      const task = await taskService.getTaskById(mockTask.id);

      expect(task).toEqual(mockTask);
    });

    it('should throw NotFoundException if task is not found', async () => {
      jest.spyOn(taskRepository, 'getTaskById').mockResolvedValueOnce(null);

      const taskError = async () => await taskService.getTaskById('notfoundid');

      expect(taskError).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTaskById', () => {
    it('should return updated task', async () => {
      const updateTask = {
        title: 'updatedtask',
      } as UpdateTaskDto;

      mockTask.title = 'updatedtask';
      jest
        .spyOn(taskRepository, 'updateTaskById')
        .mockResolvedValueOnce(mockTask);

      const task = await taskService.updateTaskById(mockTask.id, updateTask);

      expect(task).toEqual(mockTask);
    });

    it('should throw NotFoundException if task is not found', async () => {
      const updateTask = {
        title: 'updatedtask',
      } as UpdateTaskDto;

      jest.spyOn(taskRepository, 'updateTaskById').mockResolvedValueOnce(null);

      const taskError = async () =>
        await taskService.updateTaskById('notfoundid', updateTask);

      expect(taskError).rejects.toThrow(NotFoundException);
    });
  });
});
