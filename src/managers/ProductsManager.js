import ErrorManager from "./ErrorManager.js";
import ProductModel from "../models/products.model.js";
import { validateId } from "../config/mongoose.config.js";



export default class ProductManager {
    #productsModel;

    constructor() {
        this.#productsModel = ProductModel;
    }
    
    // Metodo para buscar un producto por su id
    async #findOneById(id) {
        if (!validateId(id)) {
            throw new ErrorManager ("ID no valido", 400);
        }
        
        const product = await this.#productsModel.findById(id);

        if (!product) {
            throw new ErrorManager("ID no encontrado", 404);
        }
        
        return product;
    }
    
    // Obtener un producto por su ID
    async getOneById(id) {
        try {
            const product = await this.#findOneById(id);
            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    
    // Obtiene todos los prodcutos
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
            
            return await this.#productsModel.paginate(filters, paginationOptions);
        } catch (error) {
            throw  ErrorManager.handleError(error);
        }
    }


    // Incluir un producto
    async insertOne(data) {
        try {
            const product = await this.#productsModel.create(data);
            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    
    // Actualizar un producto
    async updateOneById(id, data) {
        try {
            const product = await this.#findOneById(id);

            const newValues = { ...product, ...data};
            product.set(newValues);
            product.save();

            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    
    // Eliminar un producto 
    async deleteOneById (id) {
        try {
            const product = await this.#findOneById(id);
            await product.deleteOne();
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }
}
