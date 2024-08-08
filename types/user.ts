export interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  code?: number; // For MongoDB duplicate key error
  isOptional?: boolean;
  errmsg?: string;
  path?: string;
  value?: number;
  errors?: {};
}
