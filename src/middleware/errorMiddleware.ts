import type { NextFunction, Request, Response } from "express";
import type { ApiError } from "../helpers/apiError";
import type { ValidationError } from "class-validator";

type AppError = Error &
  Partial<ApiError> & {
    errors?: ValidationError[];
  };

export const errorMiddleware = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("ErrorMiddleware:", error);

  if (Array.isArray(error.errors) && error.errors[0]?.constraints) {
    const messages = error.errors
      .map((err) => Object.values(err.constraints ?? {}))
      .flat();

    return res.status(400).json({
      message: "erro de validação",
      errors: messages,
    });
  }

  const statusCode = error.statusCode ?? 500;
  const message = error.message || "Erro interno do servidor";

  return res.status(statusCode).json({ message });
};
