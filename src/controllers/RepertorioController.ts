import type { Request, Response, NextFunction } from "express";
import { RepertorioService } from "../services/RepertorioService.js";
import { usuarioLogado } from "../helpers/usuarioLogado.js";

export class RepertorioController {
  private repertorioService = new RepertorioService();

  criar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: usuarioId } = usuarioLogado(req);
      const musica = await this.repertorioService.criar(usuarioId, req.body);
      return res.status(201).json(musica);
    } catch (error) {
      next(error);
    }
  };

  listar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: usuarioId } = usuarioLogado(req);
      const musicas = await this.repertorioService.listar(usuarioId, {
        busca: req.query.busca as string | undefined,
        status: req.query.status as string | undefined,
      });
      return res.status(200).json(musicas);
    } catch (error) {
      next(error);
    }
  };

  buscar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: usuarioId } = usuarioLogado(req);
      const musica = await this.repertorioService.buscarPorId(
        String(req.params.id),
        usuarioId,
      );
      return res.status(200).json(musica);
    } catch (error) {
      next(error);
    }
  };

  atualizar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: usuarioId } = usuarioLogado(req);
      const musica = await this.repertorioService.atualizar(
        String(req.params.id),
        usuarioId,
        req.body,
      );
      return res.status(200).json(musica);
    } catch (error) {
      next(error);
    }
  };

  remover = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: usuarioId } = usuarioLogado(req);
      await this.repertorioService.remover(String(req.params.id), usuarioId);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
