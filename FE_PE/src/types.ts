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
export interface Note {
  id: string;
  title: string;
  text: string;
  created_at: string;
  updated_at: string;
}
