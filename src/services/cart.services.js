import CartDao from "../daos/cart.dao.js";
import Services from "./service.manager.js";

const cartDao = new CartDao();

class CartServices extends Services {
    constructor() {
        super(cartDao);
    }

    createCart = async () => {
        try {
            return await this.dao.insertOne();
        } catch (error) {
            throw error;
        }
    }

    addProdToCart = async (cartId, prodId) => {
        try {
            return await this.dao.addOneProduct(cartId, prodId);
        } catch (error) {
            throw (error);
        }
    };

    removeProdToCart = async (cartId, prodId) => {
        try {
            return await this.dao.removeProduct(cartId, prodId);
        } catch (error) {
            throw (error);
        }
    };

    updateProdQuantityToCart = async (cartId, prodId, quantity) => {
        try {
            return await this.dao.updateProductQuantity(cartId, prodId, quantity);
        } catch (error) {
            throw (error);
        }
    };

    clearCart = async (cartId) => {
        try {
            return await this.dao.clearCart(cartId);
        } catch (error) {
            throw (error);
        }
    };
}

export const cartService = new CartServices();