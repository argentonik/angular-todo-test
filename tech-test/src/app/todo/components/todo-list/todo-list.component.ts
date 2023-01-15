import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { Todo } from '../../models/todo.interface';
import { Store } from '@ngrx/store';
import {
  getFilteredTodos,
  todoError,
  todoFilters,
  todoLoading,
} from '../../store/todo.selectors';
import { todoActions, updateTodo } from '../../store/todo.actions';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent implements OnInit, OnDestroy {
  public todos$ = this.store.select(getFilteredTodos);
  public todoFilters$ = this.store.select(todoFilters);
  public todoLoading$ = this.store.select(todoLoading).pipe(debounceTime(100));
  public todoError$ = this.store.select(todoError);

  public showFilters = false;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  public ngOnInit() {
    this.todoError$.pipe(takeUntil(this.destroy$)).subscribe((err) => {
      if (!err) {
        return;
      }
      this.snackBar.open(err, 'Close', { duration: 3000 });
    });

    this.todoFilters$
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((filters) => (this.showFilters = !!filters));
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  public updateTodoStatus(todo: Todo, status: boolean) {
    this.store.dispatch(
      updateTodo({
        update: {
          id: todo.id,
          changes: {
            ...todo,
            done:
              status === true
                ? this.datePipe.transform(new Date(), 'dd-MM-yyyy')
                : status,
          },
        },
      })
    );
  }

  public deleteTodo(todoId: number) {
    this.store.dispatch(todoActions.deleteTodo({ todoId }));
  }
}
