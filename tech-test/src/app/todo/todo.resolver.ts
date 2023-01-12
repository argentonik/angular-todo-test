import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { areTodosLoaded } from './store/todo.selectors';
import { filter, first, tap } from 'rxjs/operators';
import { getTodos } from './store/todo.actions';

@Injectable()
export class TodoResolver implements Resolve<Observable<any>> {
  constructor(private store: Store) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.store.pipe(
      select(areTodosLoaded),
      tap((todosLoaded) => {
        if (!todosLoaded) {
          this.store.dispatch(getTodos());
        }
      }),
      filter((coursesLoaded) => coursesLoaded),
      first()
    );
  }
}
