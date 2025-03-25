import ProductDao from "../daos/mongodb/product.dao.js";
import ProductModel from "../daos/mongodb/models/products.model.js";
import Services from "./service.manager.js";

const productDao = new ProductDao();

class ProductServices extends Services{
    constructor(){
        super(productDao)
    }
    async getAll(params) {
        try {
            const $and = [];
            if (params?.category) $and.push({category: {$regex: params.category, $options: "i"}});
            if (params?.availability !== undefined) $and.push({ availability: params.availability });
            if (params?.title) $and.push({title: {$regex: params.title, $options: "i"}});
            const filters = $and.length > 0 ? {$and} : {};
            const sort = {
                asc:{ price: 1 },
                desc:{ price : -1,}
            }
            const paginationOptions = {
                limit : params?.limit || 10,
                page: params?.page ||1,
                sort: sort[params?.sort] ?? {},
                lean: true,
            };
            return await ProductModel.paginate(filters, paginationOptions);
        } catch (error) {
            throw (error);
        }
    }
    
    async getById (id) {
        try {
            const product = await this.dao.findOneById(id);
            return product;
        } catch (error) {
            throw (error);
        }
    }
    async insertOne(data) {
        try {
            const product = await this.dao.create(data);
            return product;
        } catch (error) {
            throw (error);
        }
    }
    async updateOneById(id, data) {
        try {
            const product = await this.dao.findOneById(id);
            const newValues = { ...product, ...data};
            product.set(newValues);
            product.save();
            return product;
        } catch (error) {
            throw (error);
        }
    }
    async deleteOneById (id) {
        try {
            const product = await this.dao.findOneById(id);
            await product.deleteOne();
        } catch (error) {
            throw (error);
        }
    }
}


export const productService = new ProductServices();