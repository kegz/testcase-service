import mongoose, { Schema, Document, Types } from "mongoose";
import { initialsFromName } from "./_helpers.js";

export interface ISuite extends Document {
  projectId: Types.ObjectId;
  name: string;
  key: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SuiteSchema = new Schema<ISuite>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    name: { type: String, required: true },
    key: { type: String, unique: true },
    description: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// auto-generate key, ensure uniqueness
SuiteSchema.pre<ISuite>("save", async function (next) {
  if (!this.key && this.name) {
    const base = initialsFromName(this.name) || "SUITE";
    let candidate = base;
    let n = 1;
    // eslint-disable-next-line no-await-in-loop
    while (await mongoose.models.Suite.findOne({ key: candidate })) {
      candidate = `${base}${n++}`;
    }
    this.key = candidate;
  }
  next();
});

export const SuiteModel = mongoose.model<ISuite>("Suite", SuiteSchema);
