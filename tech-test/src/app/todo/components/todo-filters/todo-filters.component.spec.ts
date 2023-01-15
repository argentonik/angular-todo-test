import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { TodoFiltersComponent } from './todo-filters.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { APP_CONFIG } from '../../../shared/utils/tokens';
import { TodoFilters, TodoState } from '../../store/todo.reducers';
import { MemoizedSelector, Store } from '@ngrx/store';
import { click } from '../../../shared/tests/helpers';
import { todoActions } from '../../store/todo.actions';
import { TodoStatusEnum } from '../../models/todo-status.enum';
import { MatRadioModule } from '@angular/material/radio';
import { todoFilters } from '../../store/todo.selectors';

describe('TodoFiltersComponent', () => {
  let component: TodoFiltersComponent;
  let fixture: ComponentFixture<TodoFiltersComponent>;
  let mockStore: MockStore<TodoState>;
  let mockFiltersSelector: MemoizedSelector<TodoState, TodoFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoFiltersComponent],
      imports: [MatRadioModule],
      providers: [
        provideMockStore(),
        {
          provide: APP_CONFIG,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoFiltersComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    mockStore = TestBed.get(Store);

    mockFiltersSelector = mockStore.overrideSelector(todoFilters, {
      input: '',
      status: TodoStatusEnum.All,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset filters', () => {
    const filters = {
      input: 'Test',
      status: TodoStatusEnum.Completed,
    };
    component.filters.patchValue(filters);
    click(fixture, 'reset-btn');
    expect(component.filters.value).toEqual({
      input: '',
      status: TodoStatusEnum.All,
    });
  });

  it('should dispatch clearFilters action when filters reset', () => {
    spyOn(mockStore, 'dispatch').and.callThrough();
    click(fixture, 'reset-btn');
    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    expect(mockStore.dispatch).toHaveBeenCalledWith(todoActions.clearFilters());
  });

  it('should dispatch applyFilters action when filters change', fakeAsync(async () => {
    spyOn(mockStore, 'dispatch').and.callThrough();
    const filters = {
      input: 'Test',
      status: TodoStatusEnum.Completed,
    };
    component.filters.patchValue(filters);
    tick(300);

    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      todoActions.applyFilters({ filters })
    );
  }));
});
