import { InstrumentoService } from "../services/InstrumentoService.js";
import type { Response, Request, NextFunction } from "express";

export class ProdutoController {
  private instrumentoService = new InstrumentoService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inst = await this.instrumentoService.create(req.body, req.user.id);
      return res.status(201).json(inst);
    } catch (error: unknown) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inst = await this.instrumentoService.list();
      return res.json(inst);
    } catch (error: unknown) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this.instrumentoService.delete(id);
      return res.status(204).send();
    } catch (error: unknown) {
      next(error);
    }
  };
}
