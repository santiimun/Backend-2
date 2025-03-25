import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { roleAuth } from "../middlewars/roleAuth.js"

const router = Router();

router.route("/")
    .get(productController.getAll)
    .post(roleAuth("admin"), productController.insertProd)
router.route("/:id")
    .get(productController.getByOneId)
    .put(roleAuth("admin"),productController.updateProd)
    .delete(roleAuth("admin"),productController.deleteProd)


export default router;