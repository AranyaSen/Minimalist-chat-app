import { AxiosError } from "axios";

export const handleError = (
  err: unknown,
  fallbackMessage: string = "An unexpected error occurred"
): string => {
  const axiosError = err as AxiosError<{ message: string }>;
  const errorMessage = axiosError.response?.data?.message || fallbackMessage;

  return errorMessage;
};
