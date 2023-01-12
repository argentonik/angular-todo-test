import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Todo } from '../models/todo.interface';
import { todoActions } from './todo.actions';
import { createReducer, on } from '@ngrx/store';

export interface TodoState extends EntityState<Todo> {
  todosLoaded: boolean;
}

export const adapter: EntityAdapter<Todo> = createEntityAdapter<Todo>();

export const initialState = adapter.getInitialState({
  todosLoaded: false,
});

export const todoReducer = createReducer(
  initialState,

  on(todoActions.todosLoaded, (state, action) => {
    return adapter.addMany(action.todos, { ...state, todosLoaded: true });
  }),

  on(todoActions.createTodo, (state, action) => {
    return adapter.addOne(action.todo, state);
  }),

  on(todoActions.updateTodo, (state, action) => {
    return adapter.updateOne(action.update, state);
  }),

  on(todoActions.deleteTodo, (state, action) => {
    return adapter.removeOne(action.todoId, state);
  })
);

export const { selectAll, selectIds } = adapter.getSelectors();
