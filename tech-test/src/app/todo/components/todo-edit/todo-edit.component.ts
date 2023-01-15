import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { concatMap, debounceTime, takeUntil, tap } from 'rxjs/operators';
import { Todo } from '../../models/todo.interface';
import { createTodo, updateTodo } from '../../store/todo.actions';
import { Store } from '@ngrx/store';
import { getTodoById, todoLoading } from '../../store/todo.selectors';
import * as uuid from 'uuid';
import { APP_CONFIG } from '../../../shared/utils/tokens';
import { IAppConfig } from '../../../app.config';

@Component({
  selector: 'app-todo-edit',
  templateUrl: './todo-edit.component.html',
  styleUrls: ['./todo-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoEditComponent implements OnInit, OnDestroy {
  public todo: Todo = {} as Todo;
  public todoForm = new FormGroup({
    label: new FormControl('', [
      Validators.required,
      Validators.maxLength(128),
    ]),
    category: new FormControl('', [Validators.maxLength(128)]),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(1024),
    ]),
    done: new FormControl(false),
  });

  public todo$ = this.route.params.pipe(
    concatMap((params) => {
      return params.id ? this.store.select(getTodoById(params.id)) : of({});
    }),
    tap((todo) => {
      this.todoForm.patchValue(todo);
    })
  );
  public todoLoading$ = this.store
    .select(todoLoading)
    .pipe(debounceTime(this.config.loadingDebounceTime));
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(APP_CONFIG) private config: IAppConfig,
    private route: ActivatedRoute,
    private store: Store
  ) {}

  public ngOnInit() {
    this.todo$.pipe(takeUntil(this.destroy$)).subscribe((todo) => {
      this.todo = todo as Todo;
    });
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public submit(todoId: string): void {
    if (this.todoForm.invalid) {
      this.todoForm.markAllAsTouched();
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
