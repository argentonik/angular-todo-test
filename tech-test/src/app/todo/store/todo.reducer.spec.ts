import { initialState, todoReducer, TodoState } from './todo.reducers';
import { todoActions } from './todo.actions';
import { TODO, TODOS, TODOS_DICTIONARY } from '../tests/todos.mock';

describe('TodoReducer', () => {
  let state: TodoState;

  beforeEach(() => {
    state = initialState;
    state = todoReducer(state, todoActions.todosLoaded({ todos: TODOS }));
  });

  describe('valid Todo actions', () => {
    it('on the todosLoaded action should be set a correct state', () => {
      const result = todoReducer(
        state,
        todoActions.todosLoaded({ todos: TODOS })
      );

      expect(result.todosLoaded).toBeTrue();
      expect(result.todoLoading).toBeNull();
      expect(result.error).toBeNull();
      expect(result.entities).toEqual(TODOS_DICTIONARY);
    });

    it('on the createTodo action should be set a correct state', () => {
      const result = todoReducer(state, todoActions.createTodo({ todo: TODO }));

      expect(result.todosLoaded).toBeTrue();
      expect(result.todoLoading).toBe(TODO.id);
      expect(result.error).toBeNull();
      expect(result.entities).toEqual(TODOS_DICTIONARY);
    });

    it('on the createTodoSuccess action should be set a correct state', () => {
      const result = todoReducer(
        state,
        todoActions.createTodoSuccess({ todo: { ...TODO, id: 4 } })
      );

      expect(result.todosLoaded).toBeTrue();
      expect(result.todoLoading).toBeNull();
      expect(result.error).toBeNull();
      expect(result.entities).toEqual({
        ...TODOS_DICTIONARY,
        4: { ...TODO, id: 4 },
      });
    });

    it('on the updateTodo action should be set a correct state', () => {
      const changes = {
        label: 'Updated label',
        description: 'Updated description',
      };
      const result = todoReducer(
        state,
        todoActions.updateTodo({
          update: { id: TODO.id, changes },
        })
      );

      expect(result.todosLoaded).toBeTrue();
      expect(result.todoLoading).toBe(TODO.id);
      expect(result.error).toBeNull();
      expect(result.entities).toEqual(TODOS_DICTIONARY);
    });

    it('on the updateTodoSuccess action should be set a correct state', () => {
      const changes = {
        label: 'Updated label',
        description: 'Updated description',
      };
      const result = todoReducer(
        state,
        todoActions.updateTodoSuccess({
          update: { id: TODO.id, changes },
        })
      );

      expect(result.todosLoaded).toBeTrue();
      expect(result.todoLoading).toBeNull();
      expect(result.error).toBeNull();
      expect(result.entities).toEqual({
        ...TODOS_DICTIONARY,
        [TODO.id]: { ...TODO, ...changes },
      });
    });

    it('on the deleteTodo action should be set a correct state', () => {
      const result = todoReducer(
        state,
        todoActions.deleteTodo({ todoId: TODO.id })
      );

      expect(result.todosLoaded).toBeTrue();
      expect(result.todoLoading).toBe(TODO.id);
      expect(result.error).toBeNull();
      expect(result.entities).toEqual(TODOS_DICTIONARY);
    });

    it('on the deleteTodoSuccess action should be set a correct state', () => {
      const result = todoReducer(
        state,
        todoActions.deleteTodoSuccess({ todoId: TODO.id })
      );

      expect(result.todosLoaded).toBeTrue();
      expect(result.todoLoading).toBeNull();
      expect(result.error).toBeNull();
      expect(result.entities).toEqual({
        1: TODOS_DICTIONARY[1],
        3: TODOS_DICTIONARY[3],
      });
    });

    it('on the failure action should be set a correct state', () => {
      const payload = 'Error message';
      const result = todoReducer(state, todoActions.failure({ payload }));

      expect(result.todosLoaded).toBeTrue();
      expect(result.todoLoading).toBeNull();
      expect(result.error).toBe(payload);
      expect(result.entities).toEqual(TODOS_DICTIONARY);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = todoReducer(state, action);

      expect(result).toBe(state);
    });
  });
});
