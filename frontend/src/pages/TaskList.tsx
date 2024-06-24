import { useBoolean } from '@fluentui/react-hooks';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { FocusTrapZone } from '@fluentui/react/lib/FocusTrapZone';
import { Layer } from '@fluentui/react/lib/Layer';
import { List } from '@fluentui/react/lib/List';
import { Overlay } from '@fluentui/react/lib/Overlay';
import { Popup } from '@fluentui/react/lib/Popup';
import { IStackTokens, Stack } from '@fluentui/react/lib/Stack';
import { ITheme, mergeStyleSets, normalize } from '@fluentui/react/lib/Styling';
import { useTheme } from '@fluentui/react/lib/Theme';
import {
  useMutation,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { useState } from 'react';
import { deleteTaskById } from '../services/taskServices';
import { Task } from '../types/task';
import UpdateTaskForm from './UpdateTaskForm';

interface TaskListProps {
  queryTasks: UseQueryResult<Task[], Error>;
}

export default function TaskList({ queryTasks }: TaskListProps) {
  const [isPopupVisible, { setTrue: showPopup, setFalse: hidePopup }] =
    useBoolean(false);
  const [selectedTask, setSelectedTask] = useState<Task>({} as Task);
  const theme = useTheme();

  const { data, isLoading } = queryTasks;

  const queryClient = useQueryClient();

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTaskById,
    onSuccess: (_: void, deleteTask: string) => {
      queryClient.setQueryData(['tasks'], (oldData: Task[]) => {
        return oldData.filter((todo) => todo.id !== deleteTask);
      });
    },
  });

  if (isLoading) return 'Loading...';

  const onRenderCell = (task?: Task) => {
    return (
      <div>
        <Stack horizontal horizontalAlign="space-between">
          <div className={generateStyles(theme).itemContent}>
            <span>{task?.title}</span>
          </div>
          <Stack.Item align="center">
            <Stack horizontal tokens={stackStyles}>
              <PrimaryButton
                text="edit"
                onClick={() => {
                  task && setSelectedTask(task);
                  showPopup();
                }}
              />
              <PrimaryButton
                text="delete"
                onClick={() => task && deleteTaskMutation.mutate(task?.id)}
              />
            </Stack>
          </Stack.Item>
        </Stack>
      </div>
    );
  };

  return (
    <div className={generateStyles(theme).container}>
      <List items={data} onRenderCell={onRenderCell} />
      {isPopupVisible && (
        <Layer>
          <Popup className={popupStyles.root} onDismiss={hidePopup}>
            <Overlay onClick={hidePopup} />
            <FocusTrapZone>
              <UpdateTaskForm task={selectedTask} hidePopup={hidePopup} />
            </FocusTrapZone>
          </Popup>
        </Layer>
      )}
    </div>
  );
}

const popupStyles = mergeStyleSets({
  root: {
    background: 'rgba(0, 0, 0, 0.2)',
    bottom: '0',
    left: '0',
    position: 'fixed',
    right: '0',
    top: '0',
  },
});

const generateStyles = (theme: ITheme) => {
  return mergeStyleSets({
    container: {
      overflow: 'auto',
      maxHeight: 512,
      maxWidth: 512,
      border: '1px solid ' + theme.palette.neutralLight,
      marginTop: 24,
      selectors: {
        '.ms-List-cell': {
          height: 52,
          lineHeight: 52,
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

const stackStyles: IStackTokens = {
  childrenGap: 8,
  padding: 8,
};
