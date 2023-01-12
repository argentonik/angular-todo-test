import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoRoutingModule } from './todo-routing.module';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoService } from './services/toso.service';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { todoReducer } from './store/todo.reducers';
import { EffectsModule } from '@ngrx/effects';
import { TodoEffects } from './store/todos.effects';

@NgModule({
  declarations: [TodoListComponent],
  imports: [
    CommonModule,
    TodoRoutingModule,
    FormsModule,
    StoreModule.forFeature('todos', todoReducer),
    EffectsModule.forFeature([TodoEffects]),
  ],
  providers: [TodoService],
})
export class TodoModule {}
