import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../helpers/apiError.js";

interface TokenPayload {
  id: number;
  role: "admin" | "usuario";
}

export const verificar = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError("token não fornecido");
  }

  const [schema, token] = authHeader.split(" ");

  if (schema !== "Bearer" || !token) {
    throw new UnauthorizedError();
  }
  try {
    const jwtSecret = process.env.JWT as string;
    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
    req.usuario = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch {
    throw new UnauthorizedError("token inválido ou expirado");
  }
};

export const somenteAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  if (!req.usuario || req.usuario.role !== "admin") {
    throw new UnauthorizedError(
      "acesso negado: apenas administradores podem deletar registros",
    );
  }
  next();
};
