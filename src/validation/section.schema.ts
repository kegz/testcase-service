// src/validators/section.schema.ts
import Joi from "joi";

export const createSectionSchema = Joi.object({
  suiteId: Joi.string().required(),
  name: Joi.string().min(2).required(),
  description: Joi.string().allow("", null)
});

export const updateSectionSchema = Joi.object({
  name: Joi.string().min(2),
  description: Joi.string().allow("", null),
  isActive: Joi.boolean()
});
