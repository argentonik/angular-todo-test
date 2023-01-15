export interface IAppConfig {
  typingDebounceTime: number;
  loadingDebounceTime: number;
  snackBarDurationTime: number;
}

export const AppConfig: IAppConfig = {
  typingDebounceTime: 300,
  loadingDebounceTime: 100,
  snackBarDurationTime: 3000,
};
