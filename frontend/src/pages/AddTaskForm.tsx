import { PrimaryButton } from '@fluentui/react/lib/Button';
import { DatePicker } from '@fluentui/react/lib/DatePicker';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { IStackTokens, Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { createTask } from '../services/taskServices';

const dropdownStatusOpts: IDropdownOption[] = [
  { key: 'todo', text: 'TODO' },
  { key: 'in-progress', text: 'IN-PROGRESS' },
  { key: 'completed', text: 'COMPLETED' },
];
const dropdownPriorityOpts: IDropdownOption[] = [
  { key: 'low', text: 'LOW' },
  { key: 'medium', text: 'MEDIUM' },
  { key: 'high', text: 'HIGH' },
];

export default function AddTaskForm() {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<string | undefined>('');
  const [priority, setPriority] = useState<string>('');
  const [status, setStatus] = useState<string>('todo');
  const [tagList, setTagList] = useState<string>('');

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });

      setTitle('');
      setDescription('');
      setDueDate(undefined);
      setStatus('todo');
      setPriority('');
      setTagList('');
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const handleSubmitTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({
      title: title,
      description: description,
      dueDate: dueDate,
      status: status,
      priority: priority,
      tags: tagList?.split(' ').filter((tag) => tag.trim() !== ''), // remove whitespace element
    });
  };

  return (
    <form onSubmit={handleSubmitTask}>
      <Stack>
        <TextField
          label="Title"
          value={title}
          maxLength={100}
          errorMessage={
            title && title.length > 100 ? '100 characters maximal' : undefined
          }
          onChange={(e) => setTitle(e.currentTarget.value)}
          required
        />
        <TextField
          label="Description"
          value={description}
          maxLength={1000}
          errorMessage={
            description && description.length > 1000
              ? '1000 characters maximal'
              : undefined
          }
          onChange={(e) => setDescription(e.currentTarget.value)}
          multiline
        />
        <Stack horizontal tokens={stackStyles} horizontalAlign="space-between">
          <Stack.Item grow={1}>
            <Dropdown
              label="Status"
              placeholder="Select a status"
              options={dropdownStatusOpts}
              selectedKey={status}
              required
              onChange={(_, opt?: IDropdownOption) => {
                setStatus(opt?.key as string);
              }}
            />
          </Stack.Item>
          <Stack.Item grow={1}>
            <Dropdown
              label="Priority"
              placeholder="Select a priority"
              options={dropdownPriorityOpts}
              selectedKey={priority}
              onChange={(_, opt?: IDropdownOption) => {
                setPriority(opt?.key as string);
              }}
            />
          </Stack.Item>
        </Stack>
        <DatePicker
          label="Due date"
          value={dueDate ? new Date(dueDate) : undefined}
          placeholder="Select a date"
          onSelectDate={(date) => date && setDueDate(date.toISOString())}
        />
        <TextField
          label="Tags"
          description="Separate each tags with whitespace"
          onChange={(e) => setTagList(e.currentTarget.value)}
        />
        <PrimaryButton type="submit" text="Add a new task" />
      </Stack>
    </form>
  );
}

const stackStyles: IStackTokens = {
  childrenGap: 8,
};
