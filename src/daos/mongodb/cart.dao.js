import MongoDao from "./mongo.dao.js";
import CartModel from "./models/carts.model.js";
import mongoose from "mongoose";

export default class CartDao extends MongoDao {
    constructor() {
        super(CartModel);
    }
    async findOneById(id) {
        try{
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid ID");
            }
            const cart = await this.model.findById(id);
            if (!cart) {
                throw new Error("Cart not found");
            }
            return await cart.populate("products.product");
        }catch(error){
            throw new Error(error);
        }
    }

    async insertOne() {
        try {
            return await this.model.create({
                products: [],
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    async getOneById(id) {
        try {
            return await this.model.findById(id).populate("products.product");
        } catch (error) {
            throw new Error(error);
        }
    }

    async existProduct(cartId, prodId) {
        try {
            return await this.model.findOne({
                _id: cartId,
                products: { $elemMatch: { product: prodId } }
            })
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateCart(id, obj) {
        try {
            const response = await this.model.findByIdAndUpdate(id, obj, {
                new: true,
            });
            return response;
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateProductQuantity(cartId, prodId, quantity) {
        try {
            return await this.model.findOneAndUpdate(
                { _id: cartId, 'products.product': prodId },
                { $set: { 'products.$.quantity': quantity } },
                { new: true }
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    async clearCart(cartId) {
        try {
            return await this.model.findByIdAndUpdate(
                cartId,
                { $set: { products: [] } },
                { new: true }
            );
        } catch (error) {
            throw new Error(error);
        }
    }
}