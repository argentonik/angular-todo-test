import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectAll, TodoState } from './todo.reducers';

export const todoFeatureSelector = createFeatureSelector<TodoState>('todos');

export const getAllTodos = createSelector(todoFeatureSelector, selectAll);

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
