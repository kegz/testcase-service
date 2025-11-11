import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITestCase extends Document {
  projectId: Types.ObjectId;
  suiteId: Types.ObjectId;
  sectionId: Types.ObjectId;
  title: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  type: "Functional" | "Regression" | "Performance" | "Security" | "Other";
  status: "Draft" | "Ready" | "Deprecated";
  preconditions?: string;
  steps: string;
  expectedResult?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestCaseSchema = new Schema<ITestCase>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    suiteId: { type: Schema.Types.ObjectId, ref: "Suite", required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: "Section", required: true },
    title: { type: String, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
    type: { type: String, enum: ["Functional", "Regression", "Performance", "Security", "Other"], default: "Functional" },
    status: { type: String, enum: ["Draft", "Ready", "Deprecated"], default: "Draft" },
    preconditions: { type: String },
    steps: { type: String },
    expectedResult: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const TestCaseModel = mongoose.model<ITestCase>("TestCase", TestCaseSchema);
