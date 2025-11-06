import { Router } from "express";
import { authenticate } from "prime-qa-commons";
import { listSuites, getSuite, createSuite, updateSuite, deleteSuite } from "../controllers/suite.controller.js";

const router = Router();

router.get("/",  authenticate,listSuites);
router.get("/:id",  authenticate,getSuite);
router.post("/", authenticate, createSuite);
router.put("/:id", authenticate, updateSuite);
router.delete("/:id", authenticate, deleteSuite);

export default router;
