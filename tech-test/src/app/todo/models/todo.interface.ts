export interface Todo {
  id: number;
  label: string;
  description: string;
  category: string;
  done: false | string | Date;
}
