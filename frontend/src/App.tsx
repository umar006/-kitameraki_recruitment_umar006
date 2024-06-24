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
    <>
      <TaskForm />
      <h2>Task List</h2>
      <TaskList queryTasks={data} />
    </>
  );
}

export default App;
