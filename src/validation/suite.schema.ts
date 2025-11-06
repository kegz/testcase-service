// src/validators/suite.schema.ts
import Joi from "joi";

export const createSuiteSchema = Joi.object({
  projectId: Joi.string().required(),
  name: Joi.string().min(2).required(),
  description: Joi.string().allow("", null)
});

export const updateSuiteSchema = Joi.object({
  name: Joi.string().min(2),
  description: Joi.string().allow("", null),
  isActive: Joi.boolean()
});
