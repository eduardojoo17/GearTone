import type { Request, Response, NextFunction } from "express";
import { DashboardService } from "../services/DashboardService.js";
import { usuarioLogado } from "../helpers/usuarioLogado.js";

export class DashboardController {
  private dashboardService = new DashboardService();

  resumo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: usuarioId } = usuarioLogado(req);
      const resumo = await this.dashboardService.resumo(usuarioId);
      return res.status(200).json(resumo);
    } catch (error) {
      next(error);
    }
  };
}
