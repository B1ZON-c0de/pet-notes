export interface User {
  name: string;
  email: string;
}
export interface ErrorBackend {
  code: string;
  message: string;
}
export interface RespondBackend<T> {
  success: boolean;
  data?: T;
  error?: ErrorBackend;
}
