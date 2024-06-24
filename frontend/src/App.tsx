import { Stack } from '@fluentui/react/lib/Stack';
import { useQuery } from '@tanstack/react-query';
import TaskForm from './pages/TaskForm';
import TaskList from './pages/TaskList';
import { getTaskList } from './services/taskServices';
import { Task } from './types/task';

function App() {
  const data = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: getTaskList,
  });

  return (
    <Stack>
      <Stack.Item align="center">
        <h1>Task Management</h1>
        <TaskForm />
        <h2>Task List</h2>
        <TaskList queryTasks={data} />
      </Stack.Item>
    </Stack>
  );
}

export default App;
