import express from "express";
import cors from "cors";

import { connectDb, config } from "./config/index.js";
import sectionRoutes from "./routes/section.routes.js";
import suiteRoutes from "./routes/suite.routes.js";
import testcaseRoutes from "./routes/testcase.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use((_req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src *; img-src * data: blob:; frame-src *;"
  );
  next();
});

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/suites", suiteRoutes);
app.use("/sections", sectionRoutes);
app.use("/cases", testcaseRoutes);

connectDb().then(() => {
  app.listen(config.port, () => {
    console.log(`🧪 Test Case Service listening on ${config.port}`);
  });
});
