import paths from "../utils/paths.js";
import { readJsonFile, writeJsonFile, deleteFile } from "../utils/fileHandler.js";
import { generateId } from "../utils/collectionHandler.js";
import { convertToBoolean } from "../utils/converter.js";
import ErrorManager from "./ErrorManager.js";

export default class ProductsManager {
    #jsonFilename;
    #prodcuts;

    constructor() {
        this.#jsonFilename = "products.json";
    }
    
    // Obtiene todos los prodcutos
    async getAll() {
        try {
            this.#prodcuts = await readJsonFile(paths.files, this.#jsonFilename);
            return this.#prodcuts;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }


    // Metodo para buscar un producto por su id
    async #findOneById(id) {
        this.#prodcuts = await this.getAll();
        const productFound = this.#prodcuts.find((item) => item.id === Number(id));

        if (!productFound) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return productFound;
    }


    // Obtener un producto por su ID
    async getOneById(id) {
        try {
            const productFound = await this.#findOneById(id);
            return productFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    // Incluir un producto
    async insertOne(data, file) {
        try {
            const { title, status, stock, descripcion, category, code, price } = data;

            if (!title || status === null || status === undefined || !stock || !descripcion || !category || !code || !price ) {
                throw new ErrorManager("Faltan datos obligatorios", 400);
            }

            if (!file?.filename) {
                throw new ErrorManager("Falta el archivo de la imagen", 400);
            }

            const product = {
                id: generateId(await this.getAll()),
                title,
                status: convertToBoolean(status),
                stock: Number(stock),
                descripcion,
                category,
                code,
                price: Number(price),
                thumbnail: file?.filename,
            };

            this.#prodcuts.push(product);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#prodcuts);

            return product;
        } catch (error) {
            if (file?.filename) await deleteFile(paths.images, file.filename); 
            throw new ErrorManager(error.message, error.code);
        }
    }

    // Actualizar un producto
    async updateOneById(id, data, file) {
        try {
            const { title, status, stock, descripcion, category, code, price } = data;
            const productFound = await this.#findOneById(id);
            const newThumbnail = file?.filename;

            const product = {
                id: productFound.id,
                title: title || productFound.title,
                status: status ? convertToBoolean(status) : productFound.status,  
                stock: stock ? Number(stock) : productFound.stock,  
                descripcion: descripcion || productFound.descripcion,  
                category: category || productFound.category,  
                code: code || productFound.code, 
                price: price ? Number(price) : productFound.price, 
                thumbnail: newThumbnail || productFound.thumbnail,  
            };

            const index = this.#prodcuts.findIndex((item) => item.id === Number(id));
            this.#prodcuts[index] = product;
            await writeJsonFile(paths.files, this.#jsonFilename, this.#prodcuts);

            if (file?.filename && newThumbnail !== productFound.thumbnail) {
                await deleteFile(paths.images, productFound.thumbnail);
            }

            return product;
        } catch (error) {
            if (file?.filename) await deleteFile(paths.images, file.filename); 
            throw new ErrorManager(error.message, error.code);
        }
    }

    // Eliminar un producto 
    async deleteOneById (id) {
        try {
            const productFound = await this.#findOneById(id);

            
            if (productFound.thumbnail) {
                await deleteFile(paths.images, productFound.thumbnail);
            }

            const index = this.#prodcuts.findIndex((item) => item.id === Number(id));
            this.#prodcuts.splice(index, 1);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#prodcuts);
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }
}