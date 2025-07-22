import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import express from "express";
import cors from "cors";
import { databaseConnection } from "./connections/databaseConnection.js";
import { signup } from "./routes/signup.js";
import { login } from "./routes/login.js";
import homepage from "./routes/homepage.js";
import todosRouter from "./routes/homepage.js";

await databaseConnection(process.env.databaseConnectionString);

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/todos", todosRouter);

app.post("/signup", signup);
app.post("/login", login);
app.post("/homepage", homepage);

app.listen(process.env.serverPort, () => {
  console.log(`Server listening on port ${process.env.serverPort}`);
});
