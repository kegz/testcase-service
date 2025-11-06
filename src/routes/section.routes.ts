import { Router } from "express";
import { listSections, getSection, createSection, updateSection, deleteSection } from "../controllers/section.controller.js";
import { authenticate } from "prime-qa-commons";

const router = Router();

router.get("/suite/:suiteId", authenticate, listSections);
router.get("/:id", authenticate, getSection);
router.post("/", authenticate, createSection);
router.put("/:id", authenticate, updateSection);
router.delete("/:id", authenticate, deleteSection);

export default router;
