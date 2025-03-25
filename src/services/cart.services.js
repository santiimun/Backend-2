import CartDao from "../daos/mongodb/cart.dao.js";
import Services from "./service.manager.js";


const cartDao = new CartDao();

class CartServices extends Services {
    constructor() {
        super(cartDao);
    }

    async create() {
        try {
            return await this.dao.insertOne();
        } catch (error) {
            throw (error);
        }
    }

    async getOneById(id) {
        try {
            return await this.dao.findOneById(id);
        } catch (error) {
            throw error;
        }
    }

    async addOneProduct(id, productId) {
        try {
            console.log(productId)
            const cart = await this.dao.findOneById(id);
            const productIndex = cart.products.findIndex((item) => item.product.equals(productId));

            if (productIndex >= 0) {
                cart.products[productIndex].quantity++;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }
            await cart.save();
            return cart;
        } catch (error) {
            throw (error);
        }
    };

    removeProdToCart = async (cartId, prodId) => {
        try {
            const cart = await this.dao.findOneById(cartId);

            const productIndex = cart.products.findIndex((item) => item.product._id.toString() === prodId.toString());
            if (productIndex >= 0) {
                if (cart.products[productIndex].quantity > 1) {
                    cart.products[productIndex].quantity--;
                } else {
                    cart.products.splice(productIndex, 1);
                }
                await cart.save();
                return cart;
            } else {
                throw (error)
            }
        } catch (error) {
            throw (error);
        }
    };
    async updateCart(cartId, products) {
        const cart = await this.dao.findOneById(cartId);
        cart.products = products;
        await cart.save();
        return cart;
    }

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

    async finalizePurchase(cartId, userId) {
        const cart = await CartModel.findOne({ _id: cartId, user: userId }).populate('products.product');
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        let failedProducts = [];
        let totalAmount = 0;
        for (let item of cart.products) {
            const product = item.product;
            const quantity = item.quantity;
            
            if (product.stock >= quantity) {
                product.stock -= quantity;
                await product.save();
                totalAmount += product.price * quantity;  
            } else {
                failedProducts.push(product._id);
            }
        }
        return {
            success: failedProducts.length === 0,
            failedProducts,
            totalAmount
        };
    }

}

export const cartService = new CartServices();