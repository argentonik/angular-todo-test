import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoRoutingModule } from './todo-routing.module';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoService } from './services/toso.service';

@NgModule({
  declarations: [TodoListComponent],
  imports: [CommonModule, TodoRoutingModule],
  providers: [TodoService],
})
export class TodoModule {}
