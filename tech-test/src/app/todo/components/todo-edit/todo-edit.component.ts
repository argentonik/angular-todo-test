import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Todo } from '../../models/todo.interface';
import * as uuid from 'uuid';
import { createTodo } from '../../store/todo.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-todo-edit',
  templateUrl: './todo-edit.component.html',
  styleUrls: ['./todo-edit.component.scss'],
})
export class TodoEditComponent implements OnInit, OnDestroy {
  public id: number | string;
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

  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private store: Store) {}

  public ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.id = params.id;
        console.log('id', this.id);
      });
  }

  public submit() {
    console.log(this.todoForm);
    if (this.todoForm.invalid) {
      return;
    }

    const todo: Todo = {
      id: uuid.v4(),
      ...this.todoForm.value,
    };
    this.store.dispatch(createTodo({ todo }));
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
