import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Todo } from '../models/todo.interface';
import { todoActions } from './todo.actions';
import { createReducer, on } from '@ngrx/store';

export interface TodoState extends EntityState<Todo> {
  todosLoaded: boolean;
  todoLoading?: number | string;
  error?: string;
}

export const adapter: EntityAdapter<Todo> = createEntityAdapter<Todo>();

export const initialState = adapter.getInitialState({
  todosLoaded: false,
  todoLoading: null,
  error: null,
});

export const todoReducer = createReducer(
  initialState,

  on(todoActions.todosLoaded, (state, action) => {
    return adapter.addMany(action.todos, {
      ...state,
      todosLoaded: true,
      error: null,
    });
  }),

  on(todoActions.createTodo, (state, action) => {
    return { ...state, todoLoading: action.todo.id, error: null };
  }),

  on(todoActions.createTodoSuccess, (state, action) => {
    return adapter.addOne(action.todo, {
      ...state,
      todoLoading: null,
      error: null,
    });
  }),

  on(todoActions.updateTodo, (state, action) => {
    return { ...state, todoLoading: action.update.id, error: null };
  }),

  on(todoActions.updateTodoSuccess, (state, action) => {
    return adapter.updateOne(action.update, {
      ...state,
      todoLoading: null,
      error: null,
    });
  }),

  on(todoActions.deleteTodo, (state, action) => {
    return { ...state, todoLoading: action.todoId, error: null };
  }),

  on(todoActions.deleteTodoSuccess, (state, action) => {
    return adapter.removeOne(action.todoId, {
      ...state,
      todoLoading: null,
      error: null,
    });
  }),

  on(todoActions.failure, (state, action) => {
    console.log('failure!', action);
    return { ...state, error: action.payload, todoLoading: null };
  })
);

export const { selectAll, selectIds } = adapter.getSelectors();
