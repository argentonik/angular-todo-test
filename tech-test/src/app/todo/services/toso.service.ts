import { HttpClient } from '@angular/common/http';
import { Todo } from '../models/todo.interface';
import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '../../shared/utils/tokens';
import { IEnvironment } from '../../../environments/environment';

@Injectable()
export class TodoService {
  private readonly API_URL = `${this.environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private environment: IEnvironment
  ) {}

  public getAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.API_URL}/tasks`);
  }

  public create(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(`${this.API_URL}/tasks`, todo);
  }

  public update(id: string | number, todo: Partial<Todo>): Observable<Todo> {
    return this.http.put<Todo>(`${this.API_URL}/tasks/${id}`, todo);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/tasks/${id}`);
  }
}
