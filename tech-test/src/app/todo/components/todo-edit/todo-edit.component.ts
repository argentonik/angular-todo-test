import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { Todo } from '../../models/todo.interface';
import { createTodo, updateTodo } from '../../store/todo.actions';
import { Store } from '@ngrx/store';
import { getTodoById } from '../../store/todo.selectors';
import * as uuid from 'uuid';

@Component({
  selector: 'app-todo-edit',
  templateUrl: './todo-edit.component.html',
  styleUrls: ['./todo-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoEditComponent {
  public todoForm = new FormGroup({
    label: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(128),
    ]),
    category: new FormControl('', [Validators.maxLength(128)]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(1024),
    ]),
    done: new FormControl(false),
  });
  public todo$: Observable<Todo | {}> = this.route.params.pipe(
    concatMap((params) => {
      return params.id ? this.store.select(getTodoById(params.id)) : of({});
    }),
    tap((todo) => {
      this.todoForm.patchValue(todo);
    })
  );

  constructor(private route: ActivatedRoute, private store: Store) {}

  public submit(todoId: string) {
    if (this.todoForm.invalid) {
      return;
    }

    if (todoId) {
      this.store.dispatch(
        updateTodo({
          update: { id: todoId, changes: { ...this.todoForm.value } },
        })
      );
    } else {
      this.store.dispatch(
        createTodo({ todo: { id: uuid.v4(), ...this.todoForm.value } })
      );
    }
  }
}
