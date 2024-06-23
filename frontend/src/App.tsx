import { DatePicker } from '@fluentui/react/lib/DatePicker';
import {
  Dropdown,
  IDropdownOption,
  IDropdownStyles,
} from '@fluentui/react/lib/Dropdown';
import { IStackTokens, Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';

function App() {
  const stackStyles: IStackTokens = {
    childrenGap: 8,
  };
  const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 150 } };

  const dropdownStatusOpts: IDropdownOption[] = [
    { key: 'todo', text: 'TODO' },
    { key: 'inprogress', text: 'IN-PROGRESS' },
    { key: 'completed', text: 'COMPLETED' },
  ];
  const dropdownPriorityOpts: IDropdownOption[] = [
    { key: 'low', text: 'LOW' },
    { key: 'medium', text: 'MEDIUM' },
    { key: 'high', text: 'HIGH' },
  ];

  return (
    <Stack>
      <TextField label="Title" required />
      <TextField label="Description" multiline />
      <Stack horizontal tokens={stackStyles}>
        <DatePicker label="Due date" placeholder="Select a date..." />
        <Dropdown
          label="Status"
          placeholder="Select a status"
          options={dropdownStatusOpts}
          styles={dropdownStyles}
        />
        <Dropdown
          label="Priority"
          placeholder="Select a priority"
          options={dropdownPriorityOpts}
          styles={dropdownStyles}
        />
      </Stack>
      <TextField
        label="Tags"
        description="Separate each tags with whitespace"
      />
    </Stack>
  );
}

export default App;
