import Controllers from "./controller.manager.js";
import { cartService } from "../services/cart.services.js";
import { ticketServices } from "../services/ticket.services.js";

class CartController extends Controllers{
    constructor(){
        super(cartService)
    }

    getAll = async (req, res, next) => {
        try {
            const carts = await this.service.getAll(req.query);
            res.status(200).json({ status: "success", payload: carts });
        } catch (error) {
            next(error);
        }
    }

    addOneProduct = async(req, res, next) => {
        try {
            const { cid, pid } = req.params;
            const cart = await this.service.addOneProduct(cid, pid);
            res.status(200).json({ status: "success", payload: cart });
        } catch (error) {
            next(error);
        }
    }
    getOneById = async (req, res, next) => {
        try {

            const cart = await this.service.getOneById(req.params.cid);
            res.status(200).json({ status: "success", payload: cart });
        } catch (error) {
            next (error);
        }
    }
    updateCart =  async (req, res,next) => {
        try {
            const { cid } = req.params;
            const updatedCart = await this.service.updateCart(cid, req.body); // Método que deberás implementar en CartsManager
            res.status(200).json({ status: "success", payload: updatedCart });
        } catch (error) {
            next (error);
        }
    }

    updateProdQuantity =  async (req, res, next) => {
        try {
            const { cid, pid } = req.params;
            const quantity = req.body.quantity;
            if (typeof quantity !== "number" || quantity <= 0) {
                return res.status(400).json({ status: "error", message: "La cantidad debe ser un número mayor que 0" });
            }
            const cart = await this.service.updateProdQuantityToCart(cid, pid, quantity);
            res.status(200).json({ status: "success", payload: cart });
        } catch (error) {
            next (error);
        }
    }
    removeProductCart = async (req, res, next) => {
        try {
            const { cid, pid } = req.params;
            const cart = await this.service.removeProdToCart(cid, pid); 
            res.status(200).json({ status: "success", payload: cart });
        } catch (error) {
            next (error);
        }
    }

    clearCart = async (req, res, next) => {
        try {
            const { cid } = req.params;
            const cart = await this.service.clearCart(cid);
            res.status(200).json({ status: "success", payload: cart });
        } catch (error) {
            next (error);
        }
    }


    finalizeTicket = async (req, res, next) => {
        try {
            const { cid } = req.params;
            const userEmail = req.user.email;            
            if (!userEmail) {
                return res.status(400).json({ message: "Email del usuario no encontrado" });
            }
            const { success, failedProducts, totalAmount } = await this.service.finalizePurchase(cid);
            if (!success) {
                return res.status(400).json({ message: "Compra no completada", failedProducts });
            }
            const ticket = await ticketServices.createTicket(userEmail, totalAmount);
            await this.service.clearCart(cid);
            return res.status(200).json({
                message: "Compra completada con éxito",
                ticket
            });
        } catch (error) {
            next(error);
        }
    }
}

export const cartController = new CartController(); 