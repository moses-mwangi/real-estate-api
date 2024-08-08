import { NextFunction, Request, Response } from "express";
import { CustomError } from "../types/user";
import AppError from "../utils/appError";

const handleCastErrorDb = (err: CustomError) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDb = (err: CustomError) => {
  const value = err.errmsg?.split(":").at(-2)?.slice(2);
  const message = `Duplicate fields ${value}:please try another value`;

  return new AppError(message, 400);
};

const handleValidationErrorDb = (err: CustomError) => {
  const value = Object.values(err).map((el) => el.message);
  const message = `Invalid input data: ${value.join(". ")}`;
  return new AppError(message, 400);
};

const handleJwtError = (err: CustomError) =>
  new AppError("Invalid token. Please login again!", 401);

const handleJwtExpireError = (err: CustomError) =>
  new AppError("Your token has expired. Please try to login again!", 401);

const sendErrorDEv = (err: CustomError, res: Response) => {
  res.status(err.statusCode ? err.statusCode : 500).json({
    status: err.status,
    cond: "development",
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProduction = (err: CustomError, res: Response) => {
  if (err.isOptional) {
    res.status(err.statusCode!).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDEv(err, res);
    console.log("decvvvv");
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = handleCastErrorDb(err);
    if (err.code === 11000) err = handleDuplicateFieldsDb(err);
    if (err.name === "ValidationError") err = handleValidationErrorDb(err);
    if (err.name === "JsonWebTokenError") err = handleJwtError(err);
    if (err.name === "TokenExpiredError") err = handleJwtExpireError(err);

    sendErrorProduction(err, res);
  }
};

export default globalErrorHandler;
