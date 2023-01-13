import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TodoService } from '../services/toso.service';
import { Router } from '@angular/router';
import { todoActions } from './todo.actions';
import { concatMap, map, tap } from 'rxjs/operators';

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

  createTodo$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(todoActions.createTodo),
        concatMap((action) => this.todoService.create(action.todo)),
        tap(() => this.router.navigateByUrl('/todo'))
      ),
    { dispatch: false }
  );

  updateTodo$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(todoActions.updateTodo),
        concatMap((action) =>
          this.todoService.update(action.update.id, action.update.changes)
        ),
        tap(() => this.router.navigateByUrl('/todos'))
      ),
    { dispatch: false }
  );

  deleteTodo$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(todoActions.deleteTodo),
        concatMap((action) => this.todoService.delete(action.todoId))
      ),
    { dispatch: false }
  );
}
