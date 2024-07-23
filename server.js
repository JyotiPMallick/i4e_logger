import express from "express";
import router from "./routes/writeLog.js";

const app = express();

app.use(express.json());

const writeLogController = router

app.use("/api/v1/", writeLogController)

app.listen(3000, () => console.log("server running on port 3000"));