import {Router} from "express";
import routerUsers from "./user.router.js";
import routerCarts from "./cart.router.js";
import routerProducts from "./product.router.js"


const router = Router();

router.use("/", routerUsers);
router.use("/carts", routerCarts);
router.use("/products", routerProducts)


export default router;