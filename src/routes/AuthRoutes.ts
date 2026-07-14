import { AuthController } from "../controllers/AuthController.js";
import { Router } from "express";

const router = Router();
const authController = new AuthController();

router.post("/registrar", authController.registrar);

router.post("/logar", authController.logar);

export const authRoutes = router;
