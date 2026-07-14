import type { Request, Response, NextFunction } from "express";
import { UsuarioService } from "../services/UsuarioService.js";

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

      // Corrigido: Agora chama o método findById criado no service
      const usuario = await this.usuarioService.findById(id);

      return res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  };

  atualizar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const usuario = await this.usuarioService.update(id, req.body);
      return res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  };

  remover = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this.usuarioService.delete(id);

      // Retorna 204 No Content (padrão ideal para DELETE sem corpo de resposta)
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
