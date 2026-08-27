import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController.js";

const router = Router();
const dashboardController = new DashboardController();

router.get("/", dashboardController.resumo);

export const dashboardRoutes = router;
