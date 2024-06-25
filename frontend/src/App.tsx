import { Stack } from '@fluentui/react/lib/Stack';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import AddTaskForm from './pages/AddTaskForm';
import TaskList from './pages/TaskList';

function App() {
  return (
    <Stack>
      <Stack.Item align="center" className={generateStyles().container}>
        <h1>Task Management</h1>
        <AddTaskForm />
        <h2>Task List</h2>
        <TaskList />
      </Stack.Item>
    </Stack>
  );
}

export default App;

const generateStyles = () => {
  return mergeStyleSets({
    container: {
      width: 512,
      minwidth: 512,
      maxWidth: 1024,
    },
  });
};
