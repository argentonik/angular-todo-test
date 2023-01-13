import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Todo } from '../../models/todo.interface';
import { Store } from '@ngrx/store';
import {
  getAllTodos,
  todoError,
  todoLoading,
} from '../../store/todo.selectors';
import { todoActions, updateTodo } from '../../store/todo.actions';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent implements OnInit, OnDestroy {
  public todos$: Observable<Todo[]> = this.store.select(getAllTodos);
  public todoLoading$ = this.store.select(todoLoading).pipe(debounceTime(100));
  public todoError$ = this.store.select(todoError);
  public showFilters = true;
  private destroy$ = new Subject<void>();

  constructor(private store: Store, private snackBar: MatSnackBar) {}

  public ngOnInit() {
    this.todoError$.pipe(takeUntil(this.destroy$)).subscribe((err) => {
      if (!err) {
        return;
      }
      this.snackBar.open(err, 'Close', { duration: 3000 });
    });
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
            done: status === true ? new Date().toUTCString() : status,
          },
        },
      })
    );
  }

  public deleteTodo(todoId: number) {
    this.store.dispatch(todoActions.deleteTodo({ todoId }));
  }
}
