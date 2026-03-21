export interface ApiResponseType<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}
