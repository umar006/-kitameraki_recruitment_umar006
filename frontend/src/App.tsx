import { PrimaryButton } from '@fluentui/react/lib/Button';
import { DatePicker } from '@fluentui/react/lib/DatePicker';
import {
  Dropdown,
  IDropdownOption,
  IDropdownStyles,
} from '@fluentui/react/lib/Dropdown';
import { IStackTokens, Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { useMutation } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';

type AddTask = {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: string;
  priority?: string;
  tags?: string[];
};

function App() {
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [dueDate, setDueDate] = useState<string>();
  const [priority, setPriority] = useState<string>();
  const [status, setStatus] = useState<string>('todo');
  const [tagList, setTagList] = useState<string>();

  const stackStyles: IStackTokens = {
    childrenGap: 8,
  };
  const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 150 } };

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

  const mutation = useMutation({
    mutationFn: async () => {
      const newTask: AddTask = {
        title: title,
        description: description,
        dueDate: dueDate,
        status: status,
        priority: priority,
        tags: tagList?.split(' '),
      };

      const res = await fetch('http://localhost:3000/v1/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      console.log(await res.json());
    },
    onSuccess: () => {
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('todo');
      setPriority('');
      setTagList(undefined);
    },
  });

  const handleSubmitTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmitTask}>
      <Stack>
        <TextField
          label="Title"
          onChange={(e) => setTitle(e.currentTarget.value)}
          required
        />
        <TextField
          label="Description"
          onChange={(e) => setDescription(e.currentTarget.value)}
          multiline
        />
        <Stack horizontal tokens={stackStyles}>
          <DatePicker
            label="Due date"
            placeholder="Select a date"
            onSelectDate={(date) => setDueDate(date?.toISOString())}
          />
          <Dropdown
            label="Status"
            placeholder="Select a status"
            options={dropdownStatusOpts}
            styles={dropdownStyles}
            defaultSelectedKey={'todo'}
            required
            onChange={(e, opt?: IDropdownOption) => {
              setStatus(opt?.key as string);
            }}
          />
          <Dropdown
            label="Priority"
            placeholder="Select a priority"
            options={dropdownPriorityOpts}
            styles={dropdownStyles}
            onChange={(e, opt?: IDropdownOption) => {
              setPriority(opt?.key as string);
            }}
          />
        </Stack>
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

export default App;
