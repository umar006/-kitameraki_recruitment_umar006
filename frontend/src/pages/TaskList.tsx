import { List } from '@fluentui/react/lib/List';
import { ITheme, mergeStyleSets, normalize } from '@fluentui/react/lib/Styling';
import { useTheme } from '@fluentui/react/lib/Theme';
import { UseQueryResult } from '@tanstack/react-query';
import { Task } from '../types/task';

const generateStyles = (theme: ITheme) => {
  return mergeStyleSets({
    container: {
      overflow: 'auto',
      maxHeight: 500,
      maxWidth: 500,
      border: '1px solid ' + theme.palette.neutralLight,
      marginTop: 20,
      selectors: {
        '.ms-List-cell': {
          height: 50,
          lineHeight: 50,
          textOverflow: 'clip',
          background: theme.palette.neutralLighter,
          borderBottom: '2px solid white',
        },
      },
    },
    itemContent: [
      normalize,
      {
        paddingLeft: 16,
        paddingRight: 16,
        whiteSpace: 'wrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    ],
  });
};

interface TaskListProps {
  queryTasks: UseQueryResult<Task[], Error>;
}

export default function TaskList({ queryTasks }: TaskListProps) {
  const theme = useTheme();
  const { data, isLoading } = queryTasks;

  if (isLoading) return 'Loading...';

  const onRenderCell = (task?: Task) => {
    return (
      <div className={generateStyles(theme).itemContent}>{task?.title}</div>
    );
  };

  return (
    <div className={generateStyles(theme).container}>
      <List items={data} onRenderCell={onRenderCell} />
    </div>
  );
}
