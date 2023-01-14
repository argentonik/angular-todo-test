import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';

import { TodoEffects } from './todo.effects';
import { initialState } from './todo.reducers';
import { TODO, TODOS, TODOS_DICTIONARY } from '../tests/todos.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { TodoService } from '../services/toso.service';
import { TestScheduler } from 'rxjs/testing';
import { todoActions } from './todo.actions';

describe('TodoEffects', () => {
  const todoService = jasmine.createSpyObj('todoService', [
    'getAll',
    'create',
    'update',
    'delete',
  ]);
  const errorMessage = 'Error message';
  let actions$: Observable<any>;
  let effects: TodoEffects;
  let store: MockStore<any>;
  let testScheduler;
  const key = 'todos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        TodoEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: {
            [key]: {
              ...initialState,
              todosLoaded: true,
              entities: TODOS_DICTIONARY,
              ids: Object.keys(TODOS_DICTIONARY),
            },
          },
        }),
        {
          provide: TodoService,
          useValue: todoService,
        },
      ],
    });

    effects = TestBed.inject(TodoEffects);
    store = TestBed.inject(MockStore);

    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('getTodos$', () => {
    it('should handle getTodos and return a todosLoaded action', () => {
      const todos = TODOS;
      const action = todoActions.getTodos();
      const outcome = todoActions.todosLoaded({ todos });

      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a', { a: action });
        const response = cold('-b|', { b: todos });
        todoService.getAll.and.returnValue(response);

        expectObservable(effects.getTodos$).toBe('--b', { b: outcome });
      });
    });

    it('should handle getTodos and return a failure action', () => {
      const action = todoActions.getTodos();
      const outcome = todoActions.failure({ payload: errorMessage });

      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a', { a: action });
        const response = cold('-#|', {}, { message: errorMessage });
        todoService.getAll.and.returnValue(response);

        expectObservable(effects.getTodos$).toBe('--b', { b: outcome });
      });
    });
  });

  describe('createTodo$', () => {
    it('should handle createTodo and return a createTodoSuccess action', () => {
      const todo = TODO;
      const action = todoActions.createTodo({ todo });
      const outcome = todoActions.createTodoSuccess({ todo });

      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a', { a: action });
        const response = cold('-b|', { b: todo });
        todoService.create.and.returnValue(response);

        expectObservable(effects.createTodo$).toBe('--b', { b: outcome });
      });
    });

    it('should handle createTodo and return a failure action', () => {
      const todo = TODO;
      const action = todoActions.createTodo({ todo });
      const outcome = todoActions.failure({ payload: errorMessage });

      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a', { a: action });
        const response = cold('-#|', {}, { message: errorMessage });
        todoService.create.and.returnValue(response);

        expectObservable(effects.createTodo$).toBe('--b', { b: outcome });
      });
    });
  });

  describe('updateTodo$', () => {
    it('should handle updateTodo and return a updateTodoSuccess action', () => {
      const todo = { ...TODO, label: 'New label' };
      const update = { id: TODO.id, changes: todo };
      const action = todoActions.updateTodo({ update });
      const outcome = todoActions.updateTodoSuccess({ update });

      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a', { a: action });
        const response = cold('-b|', { b: todo });
        todoService.update.and.returnValue(response);

        expectObservable(effects.updateTodo$).toBe('--b', { b: outcome });
      });
    });

    it('should handle updateTodo and return a failure action', () => {
      const todo = { ...TODO, label: 'New label' };
      const update = { id: TODO.id, changes: todo };
      const action = todoActions.updateTodo({ update });
      const outcome = todoActions.failure({ payload: errorMessage });

      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a', { a: action });
        const response = cold('-#|', {}, { message: errorMessage });
        todoService.update.and.returnValue(response);

        expectObservable(effects.updateTodo$).toBe('--b', { b: outcome });
      });
    });
  });

  describe('deleteTodo$', () => {
    it('should handle deleteTodo and return a deleteTodoSuccess action', () => {
      const action = todoActions.deleteTodo({ todoId: TODO.id });
      const outcome = todoActions.deleteTodoSuccess({ todoId: TODO.id });

      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a', { a: action });
        const response = cold('-b|', { b: null });
        todoService.delete.and.returnValue(response);

        expectObservable(effects.deleteTodo$).toBe('--b', { b: outcome });
      });
    });

    it('should handle deleteTodo and return a failure action', () => {
      const action = todoActions.deleteTodo({ todoId: TODO.id });
      const outcome = todoActions.failure({ payload: errorMessage });

      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a', { a: action });
        const response = cold('-#|', {}, { message: errorMessage });
        todoService.delete.and.returnValue(response);

        expectObservable(effects.deleteTodo$).toBe('--b', { b: outcome });
      });
    });
  });
});
