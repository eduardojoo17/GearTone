import type { Request, Response, NextFunction } from "express";
import { InstrumentoService } from "../services/InstrumentoService.js";
import { usuarioLogado } from "../helpers/usuarioLogado.js";

export class InstrumentoController {
  private instrumentoService = new InstrumentoService();

  criar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: usuarioId } = usuarioLogado(req);
      const instrumento = await this.instrumentoService.criar(
        usuarioId,
        req.body,
      );
      return res.status(201).json(instrumento);
    } catch (error) {
      next(error);
    }
  };

  listar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: usuarioId } = usuarioLogado(req);
      const status = req.query.status as string | undefined;
      const instrumentos = await this.instrumentoService.listar(
        usuarioId,
        status,
      );
      return res.status(200).json(instrumentos);
    } catch (error) {
      next(error);
    }
  };

  buscar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: usuarioId } = usuarioLogado(req);
      const instrumento = await this.instrumentoService.buscarPorId(
        String(req.params.id),
        usuarioId,
      );
      return res.status(200).json(instrumento);
    } catch (error) {
      next(error);
    }
  };

  atualizar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: usuarioId } = usuarioLogado(req);
      const instrumento = await this.instrumentoService.atualizar(
        String(req.params.id),
        usuarioId,
        req.body,
      );
      return res.status(200).json(instrumento);
    } catch (error) {
      next(error);
    }
  };

  alterarStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: usuarioId } = usuarioLogado(req);
      const instrumento = await this.instrumentoService.alterarStatus(
        String(req.params.id),
        usuarioId,
        req.body,
      );
      return res.status(200).json(instrumento);
    } catch (error) {
      next(error);
    }
  };

  definirFavorito = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: usuarioId } = usuarioLogado(req);
      const instrumento = await this.instrumentoService.definirFavorito(
        String(req.params.id),
        usuarioId,
      );
      return res.status(200).json(instrumento);
    } catch (error) {
      next(error);
    }
  };

  definirAtual = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: usuarioId } = usuarioLogado(req);
      const instrumento = await this.instrumentoService.definirAtual(
        String(req.params.id),
        usuarioId,
      );
      return res.status(200).json(instrumento);
    } catch (error) {
      next(error);
    }
  };

  remover = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: usuarioId } = usuarioLogado(req);
      await this.instrumentoService.remover(String(req.params.id), usuarioId);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
