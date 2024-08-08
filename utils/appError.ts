///THE GLOBAL CLASS TO HANDLE ALL ERRORS
import { CustomError } from "../types/user";

// class AppError extends Error {
class AppError extends Error implements CustomError {
  public statusCode?: number;
  public status: string;
  public isOptional: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOptional = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
