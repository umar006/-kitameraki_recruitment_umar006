import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskNotFoundException } from './exception/task-not-found.exception';
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
    deleteTaskById: jest.fn(),
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

      const user = {
        id: 'testid',
        email: 'testemail@test.com',
      } as JwtPayload;

      jest.spyOn(taskRepository, 'createTask').mockResolvedValueOnce(mockTask);

      const createdTask = await taskService.createTask(dto, user);

      expect(createdTask).toEqual(mockTask);
      expect(taskRepository.createTask).toHaveBeenCalledWith(dto, user);
    });
  });

  describe('getAllTasks', () => {
    it('should return two tasks', async () => {
      const user = {
        id: 'testid',
        email: 'testemail@test.com',
      } as JwtPayload;

      jest
        .spyOn(taskRepository, 'getAllTasks')
        .mockResolvedValueOnce([mockTask, mockTask]);

      const taskList = await taskService.getAllTasks({}, user);

      expect(taskList).toEqual([mockTask, mockTask]);
    });
  });

  describe('getTaskById', () => {
    it('should return task with correct id', async () => {
      const user = {
        id: 'testid',
        email: 'testemail@test.com',
      } as JwtPayload;

      jest.spyOn(taskRepository, 'getTaskById').mockResolvedValueOnce(mockTask);

      const task = await taskService.getTaskById(mockTask.id, user);

      expect(taskRepository.getTaskById).toHaveBeenCalledWith(
        mockTask.id,
        user,
      );
      expect(task).toEqual(mockTask);
    });

    it('should throw NotFoundException if task is not found', async () => {
      const user = {
        id: 'testid',
        email: 'testemail@test.com',
      } as JwtPayload;

      jest.spyOn(taskRepository, 'getTaskById').mockResolvedValueOnce(null);

      const taskId = 'notfoundid';

      await expect(taskService.getTaskById(taskId, user)).rejects.toThrow(
        TaskNotFoundException,
      );
      expect(taskRepository.getTaskById).toHaveBeenCalledWith(taskId, user);
    });
  });

  describe('updateTaskById', () => {
    it('should return updated task', async () => {
      const updateTask = {
        title: 'updatedtask',
      } as UpdateTaskDto;

      const user = {
        id: 'testid',
        email: 'testemail@test.com',
      } as JwtPayload;

      mockTask.title = 'updatedtask';
      jest
        .spyOn(taskRepository, 'updateTaskById')
        .mockResolvedValueOnce(mockTask);

      const task = await taskService.updateTaskById(
        mockTask.id,
        updateTask,
        user,
      );

      expect(taskRepository.updateTaskById).toHaveBeenCalledWith(
        mockTask.id,
        updateTask,
        user,
      );
      expect(task).toEqual(mockTask);
    });

    it('should throw NotFoundException if task is not found', async () => {
      const updateTask = {
        title: 'updatedtask',
      } as UpdateTaskDto;
      const taskId = 'notfoundid';

      const user = {
        id: 'testid',
        email: 'testemail@test.com',
      } as JwtPayload;

      jest.spyOn(taskRepository, 'updateTaskById').mockResolvedValueOnce(null);

      const taskError = async () =>
        await taskService.updateTaskById(taskId, updateTask, user);

      expect(taskError).rejects.toThrow(TaskNotFoundException);
      expect(taskRepository.updateTaskById).toHaveBeenCalledWith(
        taskId,
        updateTask,
        user,
      );
    });
  });

  describe('deleteTaskById', () => {
    it('should throw NotFoundException if task is not found', async () => {
      const user = {
        id: 'testid',
        email: 'testemail@test.com',
      } as JwtPayload;

      jest.spyOn(taskRepository, 'deleteTaskById').mockResolvedValueOnce(null);

      const taskId = 'notfoundid';

      await expect(taskService.deleteTaskById(taskId, user)).rejects.toThrow(
        TaskNotFoundException,
      );
      expect(taskRepository.deleteTaskById).toHaveBeenCalledWith(taskId, user);
    });
  });
});
