import type { Request, Response, NextFunction } from "express";
import { SessaoEstudoService } from "../services/SessaoEstudoService.js";
import { usuarioLogado } from "../helpers/usuarioLogado.js";

export class SessaoEstudoController {
  private sessaoService = new SessaoEstudoService();

  criar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: usuarioId } = usuarioLogado(req);
      const sessao = await this.sessaoService.criar(usuarioId, req.body);
      return res.status(201).json(sessao);
    } catch (error) {
      next(error);
    }
  };

  listar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: usuarioId } = usuarioLogado(req);
      const sessoes = await this.sessaoService.listar(usuarioId, {
        musicaId: req.query.musicaId as string | undefined,
        instrumentoId: req.query.instrumentoId as string | undefined,
      });
      return res.status(200).json(sessoes);
    } catch (error) {
      next(error);
    }
  };

  buscar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: usuarioId } = usuarioLogado(req);
      const sessao = await this.sessaoService.buscarPorId(
        String(req.params.id),
        usuarioId,
      );
      return res.status(200).json(sessao);
    } catch (error) {
      next(error);
    }
  };

  atualizar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: usuarioId } = usuarioLogado(req);
      const sessao = await this.sessaoService.atualizar(
        String(req.params.id),
        usuarioId,
        req.body,
      );
      return res.status(200).json(sessao);
    } catch (error) {
      next(error);
    }
  };

  remover = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: usuarioId } = usuarioLogado(req);
      await this.sessaoService.remover(String(req.params.id), usuarioId);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
