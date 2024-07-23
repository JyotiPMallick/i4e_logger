import express from "express";
import { writingLogs } from "../controller/writeLog.js";

const router = express.Router();

router.post("/writelog", writingLogs)

export default router