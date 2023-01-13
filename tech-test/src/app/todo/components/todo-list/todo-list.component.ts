import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.interface';
import { Store } from '@ngrx/store';
import { getAllTodos, todoLoading } from '../../store/todo.selectors';
import { todoActions, updateTodo } from '../../store/todo.actions';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {
  public todos$: Observable<Todo[]> = this.store.select(getAllTodos);
  public todoLoading$ = this.store.select(todoLoading).pipe(debounceTime(300));
  public showFilters = true;

  constructor(private store: Store) {}

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
