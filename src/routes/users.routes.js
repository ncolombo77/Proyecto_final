import { Router } from "express";
import { checkRole } from "../middlewares/auth.js";
import { UsersController } from "../controllers/users.controller.js";
import { uploaderDocument } from "../utils.js";

const router = Router();

router.post("/premium/:uid", checkRole(["admin"]), UsersController.modifyRole);

router.put("/:uid/documents", uploaderDocument.fields([
    { name: "identificacion", maxCount: 1 },
    { name: "domicilio", maxCount: 1 },
    { name: "estadoDeCuenta", maxCount: 1 }
]), UsersController.uploadDocuments);

export { router as usersRouter };