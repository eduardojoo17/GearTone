import type { Request, Response, NextFunction } from "express";
import { UsuarioService } from "../services/UsuarioService.js";
import { usuarioLogado } from "../helpers/usuarioLogado.js";

export class UsuarioController {
  private usuarioService = new UsuarioService();

  listar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usuarios = await this.usuarioService.list();
      return res.status(200).json(usuarios);
    } catch (error) {
      next(error);
    }
  };

  buscar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const usuario = await this.usuarioService.findById(
        id,
        usuarioLogado(req),
      );
      return res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  };

  /** Atalho para o usuário logado consultar o próprio perfil (RF01). */
  perfil = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const solicitante = usuarioLogado(req);
      const usuario = await this.usuarioService.findById(
        solicitante.id,
        solicitante,
      );
      return res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  };

  atualizar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const usuario = await this.usuarioService.update(
        id,
        req.body,
        usuarioLogado(req),
      );
      return res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  };

  remover = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this.usuarioService.delete(id, usuarioLogado(req));

      // Retorna 204 No Content (padrão ideal para DELETE sem corpo de resposta)
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
