import { Router } from "express";
import { authenticate } from "prime-qa-commons";
import { listCasesBySection, getCase, createCase, updateCase, deleteCase } from "../controllers/testcase.controller.js";

const router = Router();

router.get("/section/:sectionId", authenticate, listCasesBySection);
router.get("/:id", authenticate, getCase);
router.post("/", authenticate, createCase);
router.put("/:id", authenticate, updateCase);
router.delete("/:id", authenticate, deleteCase);

export default router;
