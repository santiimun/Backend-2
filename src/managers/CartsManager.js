
import { validateId } from "../config/mongoose.config.js";
import CartModel from "../models/carts.model.js";
import ErrorManager from "./ErrorManager.js";

export default class CartsManager {
    #cartModel;

    constructor() {
        this.#cartModel = CartModel;
    }
    
    //Obtener la lista de carritos
    async getAll(params) {
        try {
            const paginationOptions = {
                limit : params?.limit || 10,
                page: params?.page ||1,
                populate: "products.product",
                lean: true,
            };
            return await this.#cartModel.paginate({}, paginationOptions);
        } catch (error) {
            throw new ErrorManager.handleError(error);
        }
    }

    // Metodo para buscar un carrito por su ID
    async #findOneById(id) {
        if (!validateId(id)) {
            throw new ErrorManager("ID no valido", 400);
        }
        
        const cart = await this.#cartModel.findById(id).populate("products.product")
        

        if (!cart) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return cart;
    }


    // Obtiene un carrito 
    async getOneById(id) {
        try {
            return await this.#findOneById(id);
        } catch (error) {
            throw new ErrorManager.handleError(error);
        }
    }

    // Incluir un carrito
    async insertOne(data) {
        try {
            const cart = await this.#cartModel.create(data);
            return cart;
        }catch(error){
            throw ErrorManager.handleError(error);
        }
    }

    // Agrega un producto al carrito
    
async addOneProduct(id, productId) {
    try {
        const cart = await this.#findOneById(id); 
        const productIndex = cart.products.findIndex((item) => item.product.equals(productId));

        if (productIndex >= 0) {
            cart.products[productIndex].quantity++;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }
        await cart.save();

        return cart;
    } catch (error) {
        throw new ErrorManager(error.message, error.code);
    }
};

//Eliminar Carrito
async deleteOneById (id) {
        try {
            const cart = await this.#findOneById(id);
            await cart.deleteOne();
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }



// Eliminar un producto del carrito
    async removeProduct(cartId, productId) {
        const cart = await this.#findOneById(cartId); 

        const productIndex = cart.products.findIndex((item) => item.product._id.toString() === productId.toString());
        if (productIndex >= 0) {
            if (cart.products[productIndex].quantity > 1) {
                cart.products[productIndex].quantity--;
            } else {
                cart.products.splice(productIndex, 1);
            }
    
            await cart.save();
    
            return cart; 
        } else {
            throw new ErrorManager("Producto no encontrado en el carrito", 404);
        }
    }
    
    

    // Actualizar el carrito con un arreglo de productos
    async updateCart(cartId, products) {
        const cart = await this.#findOneById(cartId);
        cart.products = products;
        await cart.save();
        return cart;
    }




    // Actualizar la cantidad de un producto en el carrito
    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await this.#findOneById(cartId);
        const productIndex = cart.products.findIndex((item) => item.product._id.toString() === productId.toString());

        if (productIndex >= 0) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            return cart;
        } else {
            throw new ErrorManager("Producto no encontrado en el carrito", 404);
        }
    }
    
    
    async clearCart(cartId) {
        const cart = await this.#findOneById(cartId);
        cart.products = []; // Vaciar el arreglo de productos
        await cart.save();
        return cart;
    }
}