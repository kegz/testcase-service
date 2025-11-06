import mongoose, { Schema, Document, Types } from "mongoose";
import { initialsFromName } from "./_helpers.js";

export interface ISection extends Document {
  projectId: Types.ObjectId;
  suiteId: Types.ObjectId;
  name: string;
  key: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SectionSchema = new Schema<ISection>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    suiteId: { type: Schema.Types.ObjectId, ref: "Suite", required: true },
    name: { type: String, required: true },
    key: { type: String, unique: true },
    description: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

SectionSchema.pre<ISection>("save", async function (next) {
  if (!this.key && this.name) {
    const base = "SEC-" + (initialsFromName(this.name) || "GEN");
    let candidate = base;
    let n = 1;
    // eslint-disable-next-line no-await-in-loop
    while (await mongoose.models.Section.findOne({ key: candidate })) {
      candidate = `${base}${n++}`;
    }
    this.key = candidate;
  }
  next();
});

export const SectionModel = mongoose.model<ISection>("Section", SectionSchema);
