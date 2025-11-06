import { Request, Response } from "express";
import { SuiteModel } from "../models/Suite.model.js";
import mongoose from "mongoose";

export const listSuites = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const filter: any = {};
    if (projectId && mongoose.isValidObjectId(projectId)) filter.projectId = projectId;
    const data = await SuiteModel.find(filter).sort({ createdAt: -1 });
    return res.json(data);
  } catch (e: any) { return res.status(400).json({ message: e.message }); }
};

export const getSuite = async (req: Request, res: Response) => {
  try {
    const data = await SuiteModel.findById(req.params.id);
    if (!data) return res.status(400).json({ message: "Suite not found" }); 
    return res.json(data);
  } catch (e: any) { return res.status(400).json({ message: e.message }); }
};

export const createSuite = async (req: Request, res: Response) => {
  try {
    const doc = await SuiteModel.create(req.body);
    return res.json(doc);
  } catch (e: any) { return res.status(400).json({ message: e.message }); }
};

export const updateSuite = async (req: Request, res: Response) => {
  try {
    const doc = await SuiteModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(400).json({ message: "Suite not found" });
    return res.json(doc);
  } catch (e: any) { return res.status(400).json({ message: e.message }); }
};

export const deleteSuite = async (req: Request, res: Response) => {
  try {
    const doc = await SuiteModel.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!doc) return res.status(400).json({ message: "Suite not found" });
    return res.json(doc);
  } catch (e: any) { return res.status(400).json({ message: e.message }); }
};
