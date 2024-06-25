import { validate } from 'class-validator';
import { TaskPriorityEnum, TaskStatusEnum } from './../task.enum';
import { CreateTaskDto } from './create-task.dto';

describe('CreateTaskDto', () => {
  let createTaskDto: CreateTaskDto;

  beforeEach(() => {
    createTaskDto = new CreateTaskDto();
  });

  it('should validate a correct required create task dto', async () => {
    createTaskDto.title = 'Test Task';
    createTaskDto.status = TaskStatusEnum.INPROGRESS;

    const errors = await validate(createTaskDto);
    expect(errors.length).toBe(0);
  });

  it('should validate a correct required with optional create task dto', async () => {
    createTaskDto.title = 'Test Task';
    createTaskDto.status = TaskStatusEnum.INPROGRESS;
    createTaskDto.description = 'This is a test description';
    createTaskDto.dueDate = new Date().toISOString();
    createTaskDto.priority = TaskPriorityEnum.HIGH;
    createTaskDto.tags = ['tag1', 'tag2'];

    const errors = await validate(createTaskDto);
    expect(errors.length).toBe(0);
  });

  it('should fail if title is empty', async () => {
    createTaskDto.title = '';
    createTaskDto.status = TaskStatusEnum.INPROGRESS;

    const errors = await validate(createTaskDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail if title is exceed length limit 100', async () => {
    createTaskDto.title = 'test'.repeat(30);
    createTaskDto.status = TaskStatusEnum.INPROGRESS;

    const errors = await validate(createTaskDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.maxLength).toBeDefined();
  });

  it('should fail if status is not a valid enum', async () => {
    createTaskDto.title = 'Test Task';
    createTaskDto.status = 'INVALID_STATUS' as TaskStatusEnum;

    const errors = await validate(createTaskDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEnum).toBeDefined();
  });

  it('should fail if priority is not a valid enum', async () => {
    createTaskDto.title = 'Test Task';
    createTaskDto.status = TaskStatusEnum.INPROGRESS;
    createTaskDto.priority = 'INVALID_PRIORITY' as TaskPriorityEnum;

    const errors = await validate(createTaskDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEnum).toBeDefined();
  });

  it('should fail if dueDate is not a valid date string', async () => {
    createTaskDto.title = 'Test Task';
    createTaskDto.status = TaskStatusEnum.INPROGRESS;
    createTaskDto.dueDate = 'invalid-date';

    const errors = await validate(createTaskDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isDateString).toBeDefined();
  });

  it('should fail if description is exceed length limit 1000', async () => {
    createTaskDto.title = 'Test Task';
    createTaskDto.status = TaskStatusEnum.INPROGRESS;
    createTaskDto.description = 'too long'.repeat(200);

    const errors = await validate(createTaskDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.maxLength).toBeDefined();
  });

  it('should fail if tags are empty or exceed length limit 50', async () => {
    createTaskDto.title = 'Test Task';
    createTaskDto.status = TaskStatusEnum.INPROGRESS;
    createTaskDto.tags = [
      '',
      'tag-with-length-exceeding-fifty-characters-which-is-invalid',
    ];

    const errors = await validate(createTaskDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    expect(errors[0].constraints?.maxLength).toBeDefined();
  });
});
