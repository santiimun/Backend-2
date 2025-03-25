import MongoDao from "./mongo.dao.js";
import ProductModel from "./models/products.model.js";
import mongoose from "mongoose";

export default class ProductDao extends MongoDao{
    constructor(){
        super(ProductModel);
    }

    async findOneById(id){
        try {
            if(!mongoose.Types.ObjectId.isValid(id))
                throw new Error("Invalid ID");
            const product = await this.model.findById(id);
            if (!product)
                throw new Error("ID no encontrado");
            return product;
        } catch (error) {
            throw new Error(error);
        }
    }
}