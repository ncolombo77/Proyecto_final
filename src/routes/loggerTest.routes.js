import { Router } from "express";
import { LoggerTestController } from "../controllers/loggerTest.controller.js";


const router = Router();


router.get("/", LoggerTestController.testLogger);


export { router as loggerTestRouter };