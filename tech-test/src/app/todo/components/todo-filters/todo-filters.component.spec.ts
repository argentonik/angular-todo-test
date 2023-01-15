import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoFiltersComponent } from './todo-filters.component';
import { provideMockStore } from '@ngrx/store/testing';
import { APP_CONFIG } from '../../../shared/utils/tokens';

describe('TodoFiltersComponent', () => {
  let component: TodoFiltersComponent;
  let fixture: ComponentFixture<TodoFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoFiltersComponent],
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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
