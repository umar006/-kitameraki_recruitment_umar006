import { Stack } from '@fluentui/react/lib/Stack';
import AddTaskForm from './pages/AddTaskForm';
import TaskList from './pages/TaskList';

function App() {
  return (
    <Stack>
      <Stack.Item align="center">
        <h1>Task Management</h1>
        <AddTaskForm />
        <h2>Task List</h2>
        <TaskList />
      </Stack.Item>
    </Stack>
  );
}

export default App;
