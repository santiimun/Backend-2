import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";
import { roleAuth } from "../middlewars/roleAuth.js";

const router = Router();

router.get("/", roleAuth("admin"), cartController.getAll);
router.route("/:cid")
    .get(cartController.getOneById)
    .put(roleAuth("admin"), cartController.updateCart)
router.route("/:cid/products/:pid")
    .post(cartController.addOneProduct)
    .put(roleAuth("admin"), cartController.updateProdQuantity)
    .delete(cartController.removeProductCart)
router.delete("/:cid/products",roleAuth("admin"), cartController.clearCart);
router.post("/:cid/purchase",roleAuth("user", "admin"), cartController.finalizeTicket)


export default router;