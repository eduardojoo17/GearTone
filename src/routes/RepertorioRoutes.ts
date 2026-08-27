import { Router } from "express";
import { RepertorioController } from "../controllers/RepertorioController.js";

const router = Router();
const repertorioController = new RepertorioController();

router.post("/", repertorioController.criar);
// Aceita ?busca=texto e ?status=quero_aprender
router.get("/", repertorioController.listar);
router.get("/:id", repertorioController.buscar);
router.put("/:id", repertorioController.atualizar);
router.delete("/:id", repertorioController.remover);

export const repertorioRoutes = router;
