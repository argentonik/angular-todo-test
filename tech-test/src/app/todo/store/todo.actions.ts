import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.interface';
import { Update } from '@ngrx/entity';

export const getTodos = createAction('[Todos] Get todos');

export const todosLoaded = createAction(
  '[Todos] Todos loaded',
  props<{ todos: Todo[] }>()
);

export const todosLoading = createAction(
  '[Todos] Todos loading',
  props<{ status: boolean; id?: number | string }>()
);

export const createTodo = createAction(
  '[Todos] Create Todo',
  props<{ todo: Todo }>()
);

export const createTodoSuccess = createAction(
  '[Todos] Create Todo Success',
  props<{ todo: Todo }>()
);

export const updateTodo = createAction(
  '[Todos] Update Todo',
  props<{ update: Update<Todo> }>()
);

export const updateTodoSuccess = createAction(
  '[Todos] Update Todo Success',
  props<{ update: Update<Todo> }>()
);

export const deleteTodo = createAction(
  '[Todos] Delete Todo',
  props<{ todoId: number }>()
);

export const deleteTodoSuccess = createAction(
  '[Todos] Delete Todo Success',
  props<{ todoId: number }>()
);

export const failure = createAction(
  '[Todos] Todo failure',
  props<{ payload: string }>()
);

export const todoActions = {
  getTodos,
  todosLoaded,
  todosLoading,
  createTodo,
  createTodoSuccess,
  updateTodo,
  updateTodoSuccess,
  deleteTodo,
  deleteTodoSuccess,
  failure,
};
