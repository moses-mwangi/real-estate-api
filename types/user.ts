export interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  code?: number;
  isOptional?: boolean;
  errmsg?: string;
  path?: string;
  value?: number;
  errors?: {};
}
