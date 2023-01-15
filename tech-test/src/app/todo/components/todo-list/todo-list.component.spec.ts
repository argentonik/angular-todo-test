import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { TodoListComponent } from './todo-list.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TodoState } from '../../store/todo.reducers';
import { MemoizedSelector, Store } from '@ngrx/store';
import { Todo } from '../../models/todo.interface';
import { getFilteredTodos } from '../../store/todo.selectors';
import { TODOS } from '../../tests/todos.mock';
import { click, findElement } from '../../../shared/tests/helpers';
import { todoActions } from '../../store/todo.actions';
import {
  findElements,
  getElementTextContent,
} from '../../../shared/tests/helpers';
import { APP_CONFIG } from '../../../shared/utils/tokens';
import { DatePipe } from '@angular/common';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let mockStore: MockStore<TodoState>;
  let mockAllTodosSelector: MemoizedSelector<TodoState, Todo[]>;
  let datePipe: DatePipe;

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
      providers: [
        DatePipe,
        provideMockStore(),
        { provide: APP_CONFIG, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    datePipe = TestBed.inject(DatePipe);

    mockStore = TestBed.get(Store);
    mockAllTodosSelector = mockStore.overrideSelector(getFilteredTodos, TODOS);
    spyOn(mockStore, 'dispatch').and.callThrough();

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

  it('should hide filters by default', () => {
    const filters = findElement(fixture, 'filters');
    expect(filters).toBeNull();
  });

  it('should show switch filters on click', () => {
    click(fixture, 'filters-switch-btn');
    fixture.detectChanges();
    const filters = findElement(fixture, 'filters');
    expect(filters).toBeTruthy();
  });

  it('should show hide filters on click', () => {
    click(fixture, 'filters-switch-btn');
    fixture.detectChanges();
    click(fixture, 'filters-switch-btn');
    fixture.detectChanges();
    const filters = findElement(fixture, 'filters');
    expect(filters).toBeNull();
  });

  it('should navigate to the create page', () => {
    const addTodoBtnLink = findElement(
      fixture,
      'todo-add-btn'
    ).nativeElement.getAttribute('routerLink');
    expect(addTodoBtnLink).toEqual('create');
  });

  it('should navigate to the edit page', () => {
    const editTodoBtnLink = findElement(
      fixture,
      'todo-edit-btn'
    ).nativeElement.getAttribute('ng-reflect-router-link');
    expect(editTodoBtnLink).toBe('/todo/edit,1');
  });

  it('should update the UI when the store changes', () => {
    mockAllTodosSelector.setResult(TODOS.slice(0, 2));
    mockStore.refreshState();
    fixture.detectChanges();
    const renderedTodos = findElements(fixture, 'todo-item');
    expect(renderedTodos.length).toBe(2);
  });

  it('should dispatch the updateTodo action for a not completed todo', () => {
    const todoToUpdate = TODOS.find((todo) => !todo.done);

    const checkbox = findElement(fixture, 'todo-item-checkbox').query(
      By.css('.mat-checkbox-input')
    ).nativeElement;
    checkbox.click();

    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      todoActions.updateTodo({
        update: {
          id: todoToUpdate.id,
          changes: {
            ...todoToUpdate,
            done: datePipe.transform(new Date(), 'dd-MM-yyyy'),
          },
        },
      })
    );
  });

  it('should dispatch the updateTodo action for a completed todo', () => {
    const todoToUpdate = TODOS.find((todo) => todo.done);

    click(fixture, 'todo-mark-uncompleted-btn');

    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      todoActions.updateTodo({
        update: {
          id: todoToUpdate.id,
          changes: { ...todoToUpdate, done: false },
        },
      })
    );
  });

  it('should dispatch deleteTodo action', () => {
    const todoToDelete = TODOS[0];

    click(fixture, 'todo-delete-btn');
    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      todoActions.deleteTodo({ todoId: todoToDelete.id })
    );
  });
});
