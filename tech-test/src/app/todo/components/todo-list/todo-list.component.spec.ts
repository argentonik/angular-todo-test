import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListComponent } from './todo-list.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TodoState } from '../../store/todo.reducers';
import { MemoizedSelector, Store } from '@ngrx/store';
import { Todo } from '../../models/todo.interface';
import { getAllTodos } from '../../store/todo.selectors';
import { TODOS } from '../../tests/todos.mock';
import { findElements, getElementTextContent } from '../../tests/helpers';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let mockStore: MockStore<TodoState>;
  let mockAllTodosSelector: MemoizedSelector<TodoState, Todo[]>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoListComponent],
      imports: [
        RouterTestingModule,
        MatSnackBarModule,
        MatIconModule,
        MatDividerModule,
        MatCardModule,
        MatCheckboxModule,
        MatTooltipModule,
      ],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.get(Store);
    mockAllTodosSelector = mockStore.overrideSelector(getAllTodos, TODOS);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render todos', () => {
    const renderedTodos = findElements(fixture, 'todo-item');

    const mockTodo = TODOS[0];
    const renderedTodo = {
      label: getElementTextContent(fixture, 'todo-label'),
      category: getElementTextContent(fixture, 'todo-category'),
      description: getElementTextContent(fixture, 'todo-description'),
    };

    expect(renderedTodos.length).toBe(3);
    expect(renderedTodo.label).toBe(mockTodo.label);
    expect(renderedTodo.category).toBe(mockTodo.category);
    expect(renderedTodo.description).toBe(mockTodo.description);
  });
});
