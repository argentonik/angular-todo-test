import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.interface';
import { Update } from '@ngrx/entity';

export const getTodos = createAction('[Todos] Get todos');

export const todosLoaded = createAction(
  '[Todos] Todos loaded',
  props<{ todos: Todo[] }>()
);

export const createTodo = createAction(
  '[Todos] Create Todo',
  props<{ todo: Todo }>()
);

export const updateTodo = createAction(
  '[Todos] Update Todo',
  props<{ update: Update<Todo> }>()
);

export const deleteTodo = createAction(
  '[Todos] Delete Todo',
  props<{ todoId: number }>()
);

export const todoActions = {
  getTodos,
  todosLoaded,
  createTodo,
  updateTodo,
  deleteTodo,
};
