import { validate } from 'class-validator';
import { TaskPriorityEnum, TaskStatusEnum } from './../task.enum';
import { UpdateTaskDto } from './update-task.dto';

describe('UpdateTaskDto', () => {
  let updateTaskDto: UpdateTaskDto;

  beforeEach(() => {
    updateTaskDto = new UpdateTaskDto();
  });

  it('should validate an empty update task dto', async () => {
    const errors = await validate(updateTaskDto);
    expect(errors.length).toBe(0);
  });

  it('should validate a correct update task dto', async () => {
    updateTaskDto.title = 'Test Task';
    updateTaskDto.status = TaskStatusEnum.INPROGRESS;
    updateTaskDto.description = 'This is a test description';
    updateTaskDto.dueDate = new Date().toISOString();
    updateTaskDto.priority = TaskPriorityEnum.HIGH;
    updateTaskDto.tags = ['tag1', 'tag2'];

    const errors = await validate(updateTaskDto);
    expect(errors.length).toBe(0);
  });

  it('should fail if title is empty', async () => {
    updateTaskDto.title = '';
    updateTaskDto.status = TaskStatusEnum.INPROGRESS;

    const errors = await validate(updateTaskDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail if title is exceed length limit 100', async () => {
    updateTaskDto.title = 'test'.repeat(30);
    updateTaskDto.status = TaskStatusEnum.INPROGRESS;

    const errors = await validate(updateTaskDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.maxLength).toBeDefined();
  });

  it('should fail if status is not a valid enum', async () => {
    updateTaskDto.title = 'Test Task';
    updateTaskDto.status = 'INVALID_STATUS' as TaskStatusEnum;

    const errors = await validate(updateTaskDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEnum).toBeDefined();
  });

  it('should fail if priority is not a valid enum', async () => {
    updateTaskDto.title = 'Test Task';
    updateTaskDto.status = TaskStatusEnum.INPROGRESS;
    updateTaskDto.priority = 'INVALID_PRIORITY' as TaskPriorityEnum;

    const errors = await validate(updateTaskDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEnum).toBeDefined();
  });

  it('should fail if dueDate is not a valid date string', async () => {
    updateTaskDto.title = 'Test Task';
    updateTaskDto.status = TaskStatusEnum.INPROGRESS;
    updateTaskDto.dueDate = 'invalid-date';

    const errors = await validate(updateTaskDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isDateString).toBeDefined();
  });

  it('should fail if description is exceed length limit 1000', async () => {
    updateTaskDto.title = 'Test Task';
    updateTaskDto.status = TaskStatusEnum.INPROGRESS;
    updateTaskDto.description = 'too long'.repeat(200);

    const errors = await validate(updateTaskDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.maxLength).toBeDefined();
  });

  it('should fail if tags are empty or exceed length limit 50', async () => {
    updateTaskDto.title = 'Test Task';
    updateTaskDto.status = TaskStatusEnum.INPROGRESS;
    updateTaskDto.tags = [
      '',
      'tag-with-length-exceeding-fifty-characters-which-is-invalid',
    ];

    const errors = await validate(updateTaskDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    expect(errors[0].constraints?.maxLength).toBeDefined();
  });
});
