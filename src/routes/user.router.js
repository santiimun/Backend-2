import { Router } from "express";
import {userController} from "../controllers/user.controller.js";
import {passportCall} from "../passport/passportCall.js"

const router = Router()

router.post("/register", userController.register);

router.post("/login", userController.login);

router.get("/sessions/current", passportCall('current'), userController.privateData);

export default router;