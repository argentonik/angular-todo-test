import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.interface';
import { Store } from '@ngrx/store';
import { getAllTodos } from '../../store/todo.selectors';
import { todoActions } from '../../store/todo.actions';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent {
  todos$: Observable<Todo[]> = this.store.select(getAllTodos);

  constructor(private store: Store) {}

  deleteTodo(todoId: number) {
    this.store.dispatch(todoActions.deleteTodo({ todoId }));
  }
}
