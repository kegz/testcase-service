import { TestCaseModel } from "../models/TestCase.model.js";
import { SectionModel } from "../models/Section.model.js";
import { SuiteModel } from "../models/Suite.model.js";
import mongoose from "mongoose";
export const listCasesBySection = async (req, res) => {
    try {
        const { sectionId } = req.params;
        if (!mongoose.isValidObjectId(sectionId))
            return res.status(400).json({ message: "Invalid sectionId" });
        const data = await TestCaseModel.find({ sectionId }).sort({ createdAt: -1 });
        return res.json(data);
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
};
export const getCase = async (req, res) => {
    try {
        const doc = await TestCaseModel.findById(req.params.id);
        if (!doc)
            return res.status(400).json({ message: "Test case not found" });
        return res.json(doc);
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
};
export const createCase = async (req, res) => {
    try {
        const { title, suiteId, sectionId, ...rest } = req.body;
        if (!suiteId || !mongoose.isValidObjectId(suiteId))
            return res.status(400).json({ message: "Invalid suiteId" });
        // If sectionId not given, you'll reject or resolve first section? For Phase1 we require a valid sectionId or we fail.
        if (!sectionId || !mongoose.isValidObjectId(sectionId))
            return res.status(400).json({ message: "Invalid sectionId" });
        const section = await SectionModel.findById(sectionId);
        if (!section)
            return res.status(400).json({ message: "Section not found" });
        const suite = await SuiteModel.findById(suiteId);
        if (!suite)
            return res.status(400).json({ message: "Suite not found" });
        // Auto-link projectId from section/suite (they must match)
        const doc = await TestCaseModel.create({
            title,
            suiteId,
            sectionId,
            projectId: section.projectId,
            ...rest
        });
        return res.json(doc);
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
};
export const updateCase = async (req, res) => {
    try {
        const doc = await TestCaseModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!doc)
            return res.status(400).json({ message: "Test case not found" });
        return res.json(doc);
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
};
export const deleteCase = async (req, res) => {
    try {
        const doc = await TestCaseModel.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!doc)
            return res.status(400).json({ message: "Test case not found" });
        return res.json(doc);
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
};
