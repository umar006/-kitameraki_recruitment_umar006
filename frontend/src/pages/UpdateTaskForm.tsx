import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { DatePicker } from '@fluentui/react/lib/DatePicker';
import {
  Dropdown,
  IDropdownOption,
  IDropdownStyles,
} from '@fluentui/react/lib/Dropdown';
import { IStackTokens, Stack } from '@fluentui/react/lib/Stack';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { TextField } from '@fluentui/react/lib/TextField';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { updateTaskById } from '../services/taskServices';
import { Task } from '../types/task';

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

interface UpdateTaskProps {
  task: Task;
  hidePopup: () => void;
}

export default function UpdateTaskForm({ task, hidePopup }: UpdateTaskProps) {
  const [title, setTitle] = useState<string>(task.title);
  const [description, setDescription] = useState<string>(task.description);
  const [dueDate, setDueDate] = useState<string>(task.dueDate);
  const [priority, setPriority] = useState<string>(task.priority);
  const [status, setStatus] = useState<string>(task.status);
  const [tagList, setTagList] = useState<string>(
    task.tags ? task.tags.join(' ') : '',
  );

  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: updateTaskById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      hidePopup();
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const handleSubmitUpdateTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateTaskMutation.mutate({
      id: task.id,
      title: title,
      description: description,
      dueDate: dueDate,
      status: status,
      priority: priority,
      tags: tagList?.split(' ').filter((tag) => tag.trim() !== ''), // remove whitespace element
    });
  };

  return (
    <div role="document" className={popupStyles.content}>
      <h2>Update Task</h2>
      <form onSubmit={handleSubmitUpdateTask}>
        <Stack tokens={stackStyles}>
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
          <Stack horizontal tokens={stackStyles}>
            <DatePicker
              label="Due date"
              value={new Date(dueDate)}
              placeholder="Select a date"
              onSelectDate={(date) => date && setDueDate(date.toISOString())}
            />
            <Dropdown
              label="Status"
              placeholder="Select a status"
              options={dropdownStatusOpts}
              styles={dropdownStyles}
              selectedKey={status}
              required
              onChange={(e, opt?: IDropdownOption) => {
                setStatus(opt?.key as string);
              }}
            />
            <Dropdown
              label="Priority"
              placeholder="Select a priority"
              options={dropdownPriorityOpts}
              selectedKey={priority}
              styles={dropdownStyles}
              onChange={(e, opt?: IDropdownOption) => {
                setPriority(opt?.key as string);
              }}
            />
          </Stack>
          <TextField
            label="Tags"
            value={tagList}
            description="Separate each tags with whitespace"
            onChange={(e) => setTagList(e.currentTarget.value)}
          />
          <PrimaryButton type="submit" text="Edit" />
          <DefaultButton text="Close" onClick={hidePopup} />
        </Stack>
      </form>
    </div>
  );
}

const popupStyles = mergeStyleSets({
  content: {
    background: 'white',
    left: '50%',
    maxWidth: '512px',
    padding: '0 2em 2em',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
});

const stackStyles: IStackTokens = {
  childrenGap: 8,
};
const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 150 } };
