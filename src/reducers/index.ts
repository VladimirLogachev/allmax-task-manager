import { combineReducers } from 'redux';
import { tasks } from './tasks';
import priorityFilter from './priorityFilter';
import newTaskId from './newTaskId';

export const reducers = combineReducers({
  tasks,
  priorityFilter,
  newTaskId
});
