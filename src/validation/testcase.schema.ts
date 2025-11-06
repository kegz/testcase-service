// src/validators/testcase.schema.ts
import Joi from "joi";

export const createTestCaseSchema = Joi.object({
  title: Joi.string().min(2).required(),
  suiteId: Joi.string().required(),          // you can allow sectionId only; we’ll resolve both
  sectionId: Joi.string().allow("", null),
  priority: Joi.string().valid("Low", "Medium", "High", "Critical").default("Medium"),
  type: Joi.string().valid("Functional", "Regression", "Performance", "Security", "Other").default("Functional"),
  status: Joi.string().valid("Draft", "Ready", "Deprecated").default("Draft"),
  preconditions: Joi.string().allow("", null),
  steps: Joi.array().items(
    Joi.object({
      action: Joi.string().required(),
      expected: Joi.string().allow("", null),
      data: Joi.object().unknown(true)
    })
  ).default([]),
  expectedResult: Joi.string().allow("", null)
});

export const updateTestCaseSchema = Joi.object({
  title: Joi.string().min(2),
  priority: Joi.string().valid("Low", "Medium", "High", "Critical"),
  type: Joi.string().valid("Functional", "Regression", "Performance", "Security", "Other"),
  status: Joi.string().valid("Draft", "Ready", "Deprecated"),
  preconditions: Joi.string().allow("", null),
  steps: Joi.array().items(
    Joi.object({
      action: Joi.string().required(),
      expected: Joi.string().allow("", null),
      data: Joi.object().unknown(true)
    })
  ),
  expectedResult: Joi.string().allow("", null),
  isActive: Joi.boolean()
});
