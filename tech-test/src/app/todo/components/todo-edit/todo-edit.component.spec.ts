import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoEditComponent } from './todo-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { APP_CONFIG } from '../../../shared/utils/tokens';
import { TodoState } from '../../store/todo.reducers';
import { Store } from '@ngrx/store';
import { Todo } from '../../models/todo.interface';
import { click } from '../../../shared/tests/helpers';
import { todoActions } from '../../store/todo.actions';
import anything = jasmine.anything;

describe('TodoEditComponent', () => {
  let component: TodoEditComponent;
  let fixture: ComponentFixture<TodoEditComponent>;
  let mockStore: MockStore<TodoState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoEditComponent],
      imports: [RouterTestingModule.withRoutes([]), MatCheckboxModule],
      providers: [provideMockStore(), { provide: APP_CONFIG, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoEditComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.get(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch submit action', () => {
    spyOn(mockStore, 'dispatch').and.callThrough();
    const todo: Todo = {
      id: anything() as any,
      label: 'Test todo',
      category: 'test',
      description: 'Test description',
      done: false,
    };
    component.todoForm.patchValue(todo);
    fixture.detectChanges();
    click(fixture, 'submit-btn');

    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      todoActions.createTodo({ todo })
    );
  });

  it(`shouldn't dispatch submit action with wrong data`, () => {
    spyOn(mockStore, 'dispatch').and.callThrough();
    click(fixture, 'submit-btn');

    expect(mockStore.dispatch).toHaveBeenCalledTimes(0);
  });
});
