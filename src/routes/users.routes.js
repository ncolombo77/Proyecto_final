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

router.get("/", checkRole(["admin"]), UsersController.getUsers);

router.delete("/", checkRole(["admin"]), UsersController.deleteInactiveUsers);

router.delete("/:uid", checkRole(["admin"]), UsersController.deleteUser);

export { router as usersRouter };