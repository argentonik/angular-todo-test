import { initialState, TodoState } from './todo.reducers';
import { TODO, TODOS, TODOS_DICTIONARY } from '../tests/todos.mock';
import * as todoSelectors from './todo.selectors';
import { TodoStatusEnum } from '../models/todo-status.enum';

describe('TodoSelectors', () => {
  let state: { todos: TodoState };
  const key = 'todos';

  beforeEach(() => {
    state = {
      [key]: {
        ...initialState,
        todosLoaded: true,
        entities: TODOS_DICTIONARY,
        ids: Object.keys(TODOS_DICTIONARY),
      },
    };
  });

  it('getAllTodos should return a correct data', () => {
    const results = todoSelectors.getAllTodos(state);
    expect(results).toEqual(TODOS);
  });

  it('getFilteredTodos should return a correct data', () => {
    const filters = { input: 'Taxes', status: TodoStatusEnum.Completed };
    state = { [key]: { ...state[key], filters } };
    const results = todoSelectors.getFilteredTodos(state);
    expect(results).toEqual([TODO]);
  });

  it('getTodoById should return a correct data', () => {
    const results = todoSelectors.getTodoById(TODO.id)(state);
    expect(results).toEqual(TODO);
  });

  it('areTodosLoaded should return a correct data', () => {
    const results = todoSelectors.areTodosLoaded(state);
    expect(results).toBeTrue();
  });

  it('todoLoading should return a correct data', () => {
    state = { [key]: { ...state[key], todoLoading: TODO.id } };
    const results = todoSelectors.todoLoading(state);
    expect(results).toBe(TODO.id);
  });

  it('todoError should return a correct data', () => {
    const error = 'Error message';
    state = { [key]: { ...state[key], error } };
    const results = todoSelectors.todoError(state);
    expect(results).toBe(error);
  });

  it('todoFilters should return a correct data', () => {
    const filters = { input: 'test', status: null };
    state = { [key]: { ...state[key], filters } };
    const results = todoSelectors.todoFilters(state);
    expect(results).toBe(filters);
  });
});
