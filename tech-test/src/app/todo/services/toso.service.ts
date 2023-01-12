import { HttpClient } from '@angular/common/http';
import { Todo } from '../models/todo.interface';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class TodoService {
  private readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

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
