import mongoose, { Schema } from "mongoose";
const StepSchema = new Schema({
    action: { type: String, required: true },
    expected: { type: String },
    data: { type: Schema.Types.Mixed }
}, { _id: false });
const TestCaseSchema = new Schema({
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    suiteId: { type: Schema.Types.ObjectId, ref: "Suite", required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: "Section", required: true },
    title: { type: String, required: true },
    key: { type: String, unique: true },
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
    type: { type: String, enum: ["Functional", "Regression", "Performance", "Security", "Other"], default: "Functional" },
    status: { type: String, enum: ["Draft", "Ready", "Deprecated"], default: "Draft" },
    preconditions: { type: String },
    steps: { type: [StepSchema], default: [] },
    expectedResult: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
// TC-<00001> style
TestCaseSchema.pre("save", async function (next) {
    if (!this.key) {
        const base = "TC-";
        let seq = 1;
        let candidate = `${base}${String(seq).padStart(5, "0")}`;
        // eslint-disable-next-line no-await-in-loop
        while (await mongoose.models.TestCase.findOne({ key: candidate })) {
            seq++;
            candidate = `${base}${String(seq).padStart(5, "0")}`;
        }
        this.key = candidate;
    }
    next();
});
export const TestCaseModel = mongoose.model("TestCase", TestCaseSchema);
