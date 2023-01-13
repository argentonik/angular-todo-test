import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-todo-edit',
  templateUrl: './todo-edit.component.html',
  styleUrls: ['./todo-edit.component.scss'],
})
export class TodoEditComponent implements OnInit {
  public id: number | string;
  public todoForm = new FormGroup({
    label: new FormControl(''),
    category: new FormControl(''),
    description: new FormControl(''),
    done: new FormControl(false),
  });

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params.id;
      console.log('id', this.id);
    });
  }
}
