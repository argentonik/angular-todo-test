import { initialState, todoReducer, TodoState } from './todo.reducers';
import { todoActions } from './todo.actions';
import { TODO, TODOS, TODOS_DICTIONARY } from '../tests/todos.mock';
import { TodoStatusEnum } from '../models/todo-status.enum';

describe('TodoReducers', () => {
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

    it('on the applyFilters action should be set a correct state', () => {
      const filters = { input: 'test', status: TodoStatusEnum.Completed };
      const result = todoReducer(state, todoActions.applyFilters({ filters }));

      expect(result.todosLoaded).toBeTrue();
      expect(result.todoLoading).toBeNull();
      expect(result.error).toBeNull();
      expect(result.entities).toEqual(TODOS_DICTIONARY);
      expect(result.filters).toEqual(filters);
    });

    it('on the clearFilters action should be set a correct state', () => {
      const result = todoReducer(state, todoActions.clearFilters());

      expect(result.todosLoaded).toBeTrue();
      expect(result.todoLoading).toBeNull();
      expect(result.error).toBeNull();
      expect(result.entities).toEqual(TODOS_DICTIONARY);
      expect(result.filters).toBeNull();
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
