import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TodoService } from './toso.service';
import { TODO, TODOS } from '../tests/todos.mock';

describe('TodoService', () => {
  const url = 'http://localhost:3000';
  let service: TodoService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService],
    });
    service = TestBed.inject(TodoService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should call getAll and return an array of Todos', () => {
    service.getAll().subscribe((res) => {
      expect(res).toEqual(TODOS);
    });
    const req = httpController.expectOne({
      method: 'GET',
      url: `${url}/tasks`,
    });
    req.flush(TODOS);
  });

  it('should call create and return the created todo from the API', () => {
    const todo = TODO;
    service.create(todo).subscribe((data) => {
      expect(data).toEqual(todo);
    });
    const req = httpController.expectOne({
      method: 'POST',
      url: `${url}/tasks`,
    });
    req.flush(todo);
  });

  it('should call update and return the updated todo from the API', () => {
    const updatedTodo = { ...TODO, label: 'New label' };
    service.update(updatedTodo.id, updatedTodo).subscribe((data) => {
      expect(data).toEqual(updatedTodo);
    });
    const req = httpController.expectOne({
      method: 'PUT',
      url: `${url}/tasks/${updatedTodo.id}`,
    });
    req.flush(updatedTodo);
  });

  it('should call delete and return void', () => {
    const todo = TODO;
    service.delete(todo.id).subscribe((data) => {
      expect(data).toEqual(null);
    });
    const req = httpController.expectOne({
      method: 'DELETE',
      url: `${url}/tasks/${todo.id}`,
    });
    req.flush(null);
  });
});
