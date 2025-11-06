import { SectionModel } from "../models/Section.model.js";
import { SuiteModel } from "../models/Suite.model.js";
import mongoose from "mongoose";
export const listSections = async (req, res) => {
    try {
        const { suiteId } = req.params;
        if (!mongoose.isValidObjectId(suiteId))
            return res.status(400).json({ message: "Invalid suiteId" });
        const data = await SectionModel.find({ suiteId }).sort({ createdAt: -1 });
        return res.json(data);
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
};
export const getSection = async (req, res) => {
    try {
        const doc = await SectionModel.findById(req.params.id);
        if (!doc)
            return res.status(400).json({ message: "Section not found" });
        return res.json(doc);
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
};
export const createSection = async (req, res) => {
    try {
        const { suiteId, name, description } = req.body;
        if (!suiteId || !mongoose.isValidObjectId(suiteId))
            return res.status(400).json({ message: "Invalid sectionId" });
        const suite = await SuiteModel.findById(suiteId);
        if (!suite)
            return res.status(400).json({ message: "Suite not found" });
        // auto-link projectId from suite
        const doc = await SectionModel.create({
            suiteId,
            projectId: suite.projectId,
            name,
            description
        });
        return res.json(doc);
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
};
export const updateSection = async (req, res) => {
    try {
        const doc = await SectionModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!doc)
            return res.status(400).json({ message: "Section not found" });
        return res.json(doc);
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
};
export const deleteSection = async (req, res) => {
    try {
        const doc = await SectionModel.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!doc)
            return res.status(400).json({ message: "Section not found" });
        return res.json(doc);
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
};
