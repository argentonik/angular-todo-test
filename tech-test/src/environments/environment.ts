export interface Environment {
  production: boolean;
  apiUrl: string;
}

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};
