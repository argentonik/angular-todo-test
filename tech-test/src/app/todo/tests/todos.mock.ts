import { Todo } from '../models/todo.interface';
export const TODOS: Todo[] = [
  {
    id: 1,
    label: 'Kitchen Cleanup',
    description: 'Clean my dirty kitchen',
    category: 'house',
    done: false,
  },
  {
    id: 2,
    label: 'Taxes',
    description:
      'Start doing my taxes and contact my accountant jhon for advice',
    category: 'bureaucracy',
    done: '22-10-2019',
  },
  {
    id: 3,
    label: 'Cooking',
    description: 'Cook dinner',
    category: 'food',
    done: '22-10-2023',
  },
];

export const TODO: Todo = {
  id: 2,
  label: 'Taxes',
  description: 'Start doing my taxes and contact my accountant jhon for advice',
  category: 'bureaucracy',
  done: '22-10-2019',
};
