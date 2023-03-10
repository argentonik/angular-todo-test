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
import { TypedAction } from '@ngrx/store/src/models';
import { TodoListComponent } from '../components/todo-list/todo-list.component';

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

  const testSuccess = (
    action: TypedAction<any>,
    effect: Observable<any>,
    serviceMethod: string,
    responseContent: any,
    outcome
  ) => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: responseContent });
      todoService[serviceMethod].and.returnValue(response);

      expectObservable(effect).toBe('--b', { b: outcome });
    });
  };

  const testFailure = (
    action: TypedAction<any>,
    effect: Observable<any>,
    serviceMethod: string
  ) => {
    const outcome = todoActions.failure({ payload: errorMessage });

    testScheduler.run(({ hot, cold, expectObservable }) => {
      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, { message: errorMessage });
      todoService[serviceMethod].and.returnValue(response);

      expectObservable(effect).toBe('--b', { b: outcome });
    });
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'todo', component: TodoListComponent },
        ]),
      ],
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
      testSuccess(action, effects.getTodos$, 'getAll', todos, outcome);
    });

    it('should handle getTodos and return a failure action', () => {
      testFailure(todoActions.getTodos(), effects.getTodos$, 'getAll');
    });
  });

  describe('createTodo$', () => {
    it('should handle createTodo and return a createTodoSuccess action', () => {
      const todo = TODO;
      const action = todoActions.createTodo({ todo });
      const outcome = todoActions.createTodoSuccess({ todo });
      testSuccess(action, effects.createTodo$, 'create', todo, outcome);
    });

    it('should handle createTodo and return a failure action', () => {
      testFailure(
        todoActions.createTodo({ todo: TODO }),
        effects.createTodo$,
        'create'
      );
    });
  });

  describe('updateTodo$', () => {
    it('should handle updateTodo and return a updateTodoSuccess action', () => {
      const todo = { ...TODO, label: 'New label' };
      const update = { id: TODO.id, changes: todo };
      const action = todoActions.updateTodo({ update });
      const outcome = todoActions.updateTodoSuccess({ update });
      testSuccess(action, effects.updateTodo$, 'update', todo, outcome);
    });

    it('should handle updateTodo and return a failure action', () => {
      const update = { id: TODO.id, changes: { ...TODO, label: 'New label' } };
      const action = todoActions.updateTodo({ update });

      testFailure(action, effects.updateTodo$, 'update');
    });
  });

  describe('deleteTodo$', () => {
    it('should handle deleteTodo and return a deleteTodoSuccess action', () => {
      const action = todoActions.deleteTodo({ todoId: TODO.id });
      const outcome = todoActions.deleteTodoSuccess({ todoId: TODO.id });
      testSuccess(action, effects.deleteTodo$, 'delete', null, outcome);
    });

    it('should handle deleteTodo and return a failure action', () => {
      testFailure(
        todoActions.deleteTodo({ todoId: TODO.id }),
        effects.deleteTodo$,
        'delete'
      );
    });
  });
});
