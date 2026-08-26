import type { Request } from "express";
import { UnauthorizedError } from "./apiError.js";

/**
 * Lê o usuário que o middleware `verificar` colocou na requisição.
 * Serve de proteção caso alguma rota seja montada sem o middleware.
 */
export const usuarioLogado = (req: Request) => {
  if (!req.usuario) throw new UnauthorizedError("Usuário não autenticado");
  return req.usuario;
};
