import { Router } from "express";
import { MockingController } from "../controllers/mocking.controller.js";


const router = Router();


router.get("/", MockingController.getMockingProducts);


export { router as mockingRouter };