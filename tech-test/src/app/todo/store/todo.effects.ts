import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TodoService } from '../services/toso.service';
import { Router } from '@angular/router';
import { todoActions } from './todo.actions';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class TodoEffects {
  constructor(
    private todoService: TodoService,
    private actions$: Actions,
    private router: Router
  ) {}

  getTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(todoActions.getTodos),
      concatMap(() => this.todoService.getAll()),
      map((todos) => todoActions.todosLoaded({ todos }))
    )
  );

  createTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(todoActions.createTodo),
      concatMap((action) =>
        this.todoService.create(action.todo).pipe(
          map(() => todoActions.createTodoSuccess(action)),
          catchError((error) => {
            return of(todoActions.failure({ payload: error.message }));
          })
        )
      ),
      tap(() => this.router.navigateByUrl('/todo'))
    )
  );

  updateTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(todoActions.updateTodo),
      concatMap((action) =>
        this.todoService.update(action.update.id, action.update.changes).pipe(
          map(() => todoActions.updateTodoSuccess(action)),
          catchError((error) => {
            return of(todoActions.failure({ payload: error.message }));
          })
        )
      ),
      tap(() => this.router.navigateByUrl('/todo'))
    )
  );

  deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(todoActions.deleteTodo),
      concatMap((action) =>
        this.todoService.delete(action.todoId).pipe(
          map(() => todoActions.deleteTodoSuccess(action)),
          catchError((error) => {
            return of(todoActions.failure({ payload: error.message }));
          })
        )
      )
    )
  );
}