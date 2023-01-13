import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoResolver } from './todo.resolver';
import { TodoEditComponent } from './components/todo-edit/todo-edit.component';

const routes: Routes = [
  {
    path: '',
    component: TodoListComponent,
    resolve: {
      courses: TodoResolver,
    },
    pathMatch: 'full',
  },
  {
    path: 'create',
    component: TodoEditComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodoRoutingModule {}
