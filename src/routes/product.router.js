import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { roleAuth } from "../middlewars/roleAuth.js"
import passport from "passport";

const router = Router();

router.route("/")
    .get(productController.getAll)
    .post(passport.authenticate('current', {session: false}),roleAuth("admin"), productController.insertProd)
router.route("/:id")
    .get(productController.getByOneId)
    .put(passport.authenticate('current', {session: false}), roleAuth("admin"),productController.updateProd)
    .delete(passport.authenticate('current', {session: false}), roleAuth("admin"),productController.deleteProd)


export default router;