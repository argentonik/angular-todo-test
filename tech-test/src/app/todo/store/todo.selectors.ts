import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectAll, TodoFilters, TodoState } from './todo.reducers';
import { TodoStatusEnum } from '../models/todo-status.enum';
import { Todo } from '../models/todo.interface';

export const todoFeatureSelector = createFeatureSelector<TodoState>('todos');

export const getAllTodos = createSelector(todoFeatureSelector, selectAll);

export const getFilteredTodos = createSelector(todoFeatureSelector, (state) => {
  const todos = Object.values(state.entities);
  const filters = state.filters;
  if (!filters) {
    return todos;
  }

  return filterTodos(todos, filters);
});

export const getTodoById = (id: string | number) =>
  createSelector(getAllTodos, (allItems) => {
    if (allItems) {
      return allItems.find((item) => item.id.toString() === id.toString());
    } else {
      return null;
    }
  });

export const areTodosLoaded = createSelector(
  todoFeatureSelector,
  (state) => state.todosLoaded
);

export const todoLoading = createSelector(
  todoFeatureSelector,
  (state) => state.todoLoading
);

export const todoError = createSelector(
  todoFeatureSelector,
  (state) => state.error
);

export const todoFilters = createSelector(
  todoFeatureSelector,
  (state) => state.filters
);

const filterTodos = (todos: Todo[], filters: TodoFilters): Todo[] => {
  const input = filters.input.toLowerCase();

  return todos.filter((todo) => {
    const inputFilter =
      todo.label.toLowerCase().includes(input) ||
      todo.description.toLowerCase().includes(input) ||
      todo.category.toLowerCase().includes(input);

    let statusFilter = true;
    switch (filters.status) {
      case TodoStatusEnum.All:
        statusFilter = true;
        break;
      case TodoStatusEnum.Completed:
        statusFilter = !!todo.done;
        break;
      case TodoStatusEnum.NotCompleted:
        statusFilter = !todo.done;
        break;
    }
    return inputFilter && statusFilter;
  });
};
