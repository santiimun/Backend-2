import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";
import { roleAuth } from "../middlewars/roleAuth.js";
import passport from "passport";

const router = Router();

router.get("/",passport.authenticate('current', {session: false}), roleAuth("admin"), cartController.getAll);
router.route("/:cid")
    .get(cartController.getOneById)
    .put(passport.authenticate('current', {session: false}), roleAuth("admin"), cartController.updateCart)
router.route("/:cid/products/:pid")
    .post(passport.authenticate('current', {session: false}), roleAuth("user", "admin"), cartController.addOneProduct)
    .put(passport.authenticate('current', {session: false}), roleAuth("admin"), cartController.updateProdQuantity)
    .delete(passport.authenticate('current', {session: false}), roleAuth("user", "admin"), cartController.removeProductCart)
router.delete("/:cid/products",passport.authenticate('current', {session: false}), roleAuth("admin"), cartController.clearCart);
router.post("/:cid/purchase",passport.authenticate('current', {session: false}), roleAuth("user", "admin"), cartController.finalizeTicket)


export default router;