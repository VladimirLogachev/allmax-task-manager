import * as React from 'react';
import * as PropTypes from 'prop-types';
import './TaskList.css';

import FilterList from '../FilterList/FilterList';
import { format_dd_mm_yyyy } from '../../util/format_dd_mm_yyyy';
import { GroupOfTasks } from '../GroupOfTasks/GroupOfTasks';

export const TaskList = ({ tasks, onTaskClick, onTaskDelete }) => {
  const placeholder = (
    <div className="placeholder">
      <p>No tasks here, let's write some!</p>
      <p className="smile">\ (•◡•) /</p>
    </div>
  );

  const now = new Date().getTime();

  const sortByPriority = (a, b) => {
    const diffPriority = b.priority - a.priority;
    const diffId = a.id - b.id;
    return diffPriority || diffId;
  };

  const sortByCompletionDate = (a, b) => {
    const diffPriority = b.completionDate - a.completionDate;
    const diffId = a.id - b.id;
    return diffPriority || diffId;
  };

  const isTaskComplete = t => {
    const complete = t.completionDate !== 'DATE_UNSET' ? true : false;
    return complete;
  };

  const hasDeadline = t => t.deadline !== 'DATE_UNSET';

  const isTaskFailed = t => {
    const complete = isTaskComplete(t);
    const isFailed = hasDeadline(t) ? (complete ? t.completionDate > t.deadline : now > t.deadline) : false;
    return isFailed;
  };

  const isTaskForToday = t => format_dd_mm_yyyy(now) === format_dd_mm_yyyy(t.deadline);

  const groupTasksByDeadline = (acc, t) => {
    if (t.deadline in acc) {
      return { ...acc, [t.deadline]: [...acc[t.deadline], t] };
    } else return { ...acc, [t.deadline]: [t] };
  };

  const completeTasks = tasks.filter(isTaskComplete);

  const incompleteTasks = tasks.filter(t => !isTaskComplete(t));
  const failedIncompleteTasks = incompleteTasks.filter(isTaskFailed);

  const nonFailedIncompleteTasks = incompleteTasks.filter(t => !isTaskFailed(t));

  const openTasksWithDeadline = nonFailedIncompleteTasks.filter(hasDeadline);
  const openTasksWithoutDeadline = nonFailedIncompleteTasks.filter(t => !hasDeadline(t));

  const tasksForToday = openTasksWithDeadline.filter(isTaskForToday);

  const tasksForOther = openTasksWithDeadline.filter(t => !isTaskForToday(t));
  const set = tasksForOther.reduce(groupTasksByDeadline, {});
  const tasksForOtherDays = Object.keys(set)
    .map(k => ({ deadline: k, tasks: set[k] }))
    .sort((a, b) => +a.deadline - +b.deadline); // TODO: refactor comparison

  return (
    <div>
      <FilterList />
      {!tasks.length ? placeholder : ''}
      <GroupOfTasks
        tasks={failedIncompleteTasks}
        onTaskClick={onTaskClick}
        onTaskDelete={onTaskDelete}
        sortWith={sortByPriority}
      />

      <GroupOfTasks
        heading="Today"
        tasks={tasksForToday}
        onTaskClick={onTaskClick}
        onTaskDelete={onTaskDelete}
        sortWith={sortByPriority}
      />

      <GroupOfTasks
        heading="Tasks without deadline"
        tasks={openTasksWithoutDeadline}
        onTaskClick={onTaskClick}
        onTaskDelete={onTaskDelete}
        sortWith={sortByPriority}
      />

      {tasksForOtherDays.map((g, i) => (
        <GroupOfTasks
          heading={format_dd_mm_yyyy(+g.deadline)}
          tasks={g.tasks}
          key={i}
          onTaskClick={onTaskClick}
          onTaskDelete={onTaskDelete}
          sortWith={sortByPriority}
        />
      ))}

      <GroupOfTasks
        heading="Completed tasks"
        tasks={completeTasks}
        onTaskClick={onTaskClick}
        onTaskDelete={onTaskDelete}
        sortWith={sortByCompletionDate}
      />
    </div>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      priority: PropTypes.number.isRequired,
      deadline: PropTypes.any,
      completionDate: PropTypes.any
    })
  ).isRequired,
  onTaskClick: PropTypes.func.isRequired,
  onTaskDelete: PropTypes.func.isRequired
};
