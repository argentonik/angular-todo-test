import { Component, OnDestroy, OnInit } from '@angular/core';
import { TodoStatusEnum } from '../../models/todo-status.enum';
import { FormControl, FormGroup } from '@angular/forms';
import { applyFilters, clearFilters } from '../../store/todo.actions';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { todoFilters } from '../../store/todo.selectors';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-todo-filters',
  templateUrl: './todo-filters.component.html',
  styleUrls: ['./todo-filters.component.scss'],
})
export class TodoFiltersComponent implements OnInit, OnDestroy {
  public todoFilters$ = this.store.select(todoFilters);

  public readonly todoStatuses = TodoStatusEnum;
  public filters = new FormGroup({
    input: new FormControl(''),
    status: new FormControl(this.todoStatuses.All),
  });
  private destroy$ = new Subject<void>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.filters.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((filters) => {
        this.store.dispatch(applyFilters({ filters }));
      });

    this.todoFilters$
      .pipe(
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.destroy$)
      )
      .subscribe((filters) => {
        if (filters) {
          this.filters.patchValue(filters);
        }
      });
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public resetFilters() {
    this.store.dispatch(clearFilters());
    this.filters.patchValue({ input: '', status: TodoStatusEnum.All });
  }
}
